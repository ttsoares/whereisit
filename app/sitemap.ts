import type { MetadataRoute } from "next";

// SITE_URL (Vercel env) overrides the domain, e.g. for a custom domain
export const SITE = process.env.SITE_URL || "https://whereisit.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/search", "/browse", "/oneDvd", "/allComments", "/statistics"].map((p) => ({ url: SITE + p }));
}
