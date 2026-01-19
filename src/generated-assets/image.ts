import { ImageResponse } from "@takumi-rs/image-response";
import { renderToStaticMarkup } from "react-dom/server";
import { FONTS, COLORS } from "./theme";
import type { JSX } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { match } from "ts-pattern";

export type AssetImageConfig = {
  width: number;
  height: number;
  debugScale?: number;
};

let fontsCache: Awaited<ReturnType<typeof loadFonts>> | null = null;

async function loadFonts() {
  return Promise.all(
    FONTS.map(async ({ url, ...font }) => ({
      ...font,
      data: await match(import.meta.env.DEV)
        .with(true, () => fs.readFile(`./public${url}`))
        .with(false, async () => {
          const res = await fetch(new URL(url, import.meta.env.SITE));
          if (!res.ok) throw new Error(`Failed to fetch font: ${url}`);
          return Buffer.from(await res.arrayBuffer());
        })
        .run(),
    }))
  );
}

async function getFonts() {
  return (fontsCache ??= await loadFonts());
}

export async function PNG(component: JSX.Element, config: AssetImageConfig) {
  const response = new ImageResponse(component, {
    width: config.width,
    height: config.height,
    fonts: await getFonts(),
  });

  return response.arrayBuffer();
}

export async function DEBUG_HTML(
  component: JSX.Element,
  params: AssetImageConfig
) {
  const html = renderToStaticMarkup(component);
  return `<!DOCTYPE html>
    <html>
      <head>
        <title>Debug OG Image</title>
        <style>
        ${FONTS.map(
          (font) => `
            @font-face {
              font-family: "${font.name}";
              font-style: ${font.style};
              font-weight: ${font.weight};
              src: url("${font.url}") format("${
            font.url.endsWith(".ttf") ? "truetype" : "woff"
          }");
            }
          `
        ).join("\n")}
          :root {
            --width: ${params.width}px;
            --height: ${params.height}px;
            --scale: ${params.debugScale ?? 0.5};
          }
          body {
            background: ${COLORS.background} url('/debug.png') repeat;
            margin: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: calc(var(--width)*var(--scale));
            min-height: calc(var(--height)*var(--scale));
          }
          #screen {
            width: calc(var(--width)*var(--scale));
            height: calc(var(--height)*var(--scale));
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border-radius: 8px;
          }
          #render {
            width: var(--width);
            height: var(--height);
            flex: none;
            transform: scale(var(--scale));
            transform-origin: top left;
            background: white;
          }
        </style>
      </head>
      <body>
        <div id="screen">
          <div id="render">
            ${html}
          </div>
        </div>
      </body>
    </html>`;
}

export function generateImageResponsePNG(buffer: ArrayBuffer) {
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export function generateImageResponseHTML(html: string) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export function getImageNameFromTsxPath(path: string) {
  return path
    .split("/")
    .at(-1)
    ?.replace(/\.tsx$/, "")
    .replace(/^_/, "");
}

function getAstroImagePath(image: ImageMetadata) {
  return import.meta.env.DEV
    ? path.resolve(image.src.replace(/\?.*/, "").replace("/@fs", ""))
    : image.src;
}

async function getAstroImageBuffer(image: ImageMetadata) {
  const fileExtension = RegExp(/.(jpg|jpeg|png)$/)
    .exec(image.src)?.[0]
    .slice(1);
  const fileToRead = getAstroImagePath(image);

  return {
    buffer: await match(import.meta.env.DEV || !import.meta.env.SSR)
      .with(true, async () => await fs.readFile(fileToRead))
      .with(false, async () => {
        const res = await fetch(new URL(fileToRead, import.meta.env.SITE));

        if (!res.ok) {
          throw new Error(`Failed to fetch image: ${fileToRead}`);
        }

        return Buffer.from(await res.arrayBuffer());
      })
      .run(),
    fileType: match(fileExtension)
      .with("jpg", "jpeg", () => "jpeg")
      .with("png", () => "png")
      .otherwise(() => {
        throw new Error(`Must be a jpg, jpeg or png`);
      }),
  };
}

export async function getAstroImageBase64(image: ImageMetadata) {
  const { buffer, fileType } = await getAstroImageBuffer(image);
  return imageBufferToBase64(buffer, fileType);
}

export function imageBufferToBase64(buffer: Buffer, fileType: string) {
  return `data:image/${fileType};base64, ${buffer.toString("base64")}`;
}
