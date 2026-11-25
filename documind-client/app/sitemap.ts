import type { MetadataRoute } from "next";
import { PUBLIC_PAGES, localizedUrl, routing } from "./lib/site";

/** Date of the last content change in the repo (fixed, not build time). */
const LAST_MODIFIED = new Date("2026-11-24T14:11:51Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [l, localizedUrl(l, path)])
          ),
          "x-default": localizedUrl(routing.defaultLocale, path),
        },
      },
    }))
  );
}
