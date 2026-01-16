import type { APIRoute } from "astro";
import { ImageResponse } from "@takumi-rs/image-response";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const modules = import.meta.glob("../_*.tsx", { eager: true });

    const module = Object.entries(modules).find(([path]) =>
      path.includes(`_${params.image}.tsx`)
    )?.[1] as any;

    if (!module?.default) {
      return new Response("Image not found", { status: 404 });
    }

    const component = module.default();

    const image = new ImageResponse(component, {
      width: 1200,
      height: 630,
    });

    const buffer = await image.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating image", { status: 500 });
  }
};
