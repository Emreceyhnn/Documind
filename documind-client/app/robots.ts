import type { MetadataRoute } from "next";
import { PRIVATE_PATHS, SITE_URL, routing } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    ...PRIVATE_PATHS.flatMap((path) => [
      path,
      ...routing.locales.map((locale) => `/${locale}${path}`),
    ]),
  ];

  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
