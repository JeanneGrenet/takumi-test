import { ImageResponse } from "@takumi-rs/image-response";
import { renderToStaticMarkup } from "react-dom/server";
import { FONTS, COLORS } from "./theme";
import type { JSX } from "react";

export type AssetImageConfig = {
  width: number;
  height: number;
  debugScale?: number;
};

export async function PNG(component: JSX.Element, params: AssetImageConfig) {
  const imageResponse = new ImageResponse(component, {
    width: params.width,
    height: params.height,
  });

  return await imageResponse.arrayBuffer();
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
              font-family: ${font.name};
              font-style: ${font.style};
              font-weight: ${font.weight};
              src: url("${font.url}") format("woff");
            }
          `
        ).join(" ")}
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
