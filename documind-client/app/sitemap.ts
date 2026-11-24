import type { MetadataRoute } from "next";
import { PUBLIC_PAGES, localizedUrl, routing } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
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
