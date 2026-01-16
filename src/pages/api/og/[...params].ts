import { apiImageEndpoint } from "@/generated-assets/api";
import type { APIRoute } from "astro";

const modules = import.meta.glob<any>("./_*.tsx", { eager: true });

export const prerender = false;

export const GET: APIRoute = async ({ params: rawParams, ...rest }) => {
  const [__image, __type] = (rawParams.params || "").split("/");

  console.log(`[Route] Parsed: ${__image}/${__type}`);

  const handler = apiImageEndpoint(modules);
  return handler({
    ...rest,
    params: {
      __image,
      __type,
      ...rawParams,
    },
  });
};
