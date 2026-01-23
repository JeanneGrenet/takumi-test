// Need to be in an asset directory because if it's at Pages root,
// the favicon.ico and other files in the public directory are
// trying to be generated and it causes issues

import { apiImageEndpoint } from "@bearstudio/astro-assets-generation";

import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = apiImageEndpoint(
  import.meta.glob("./_*.tsx", { eager: true })
);
