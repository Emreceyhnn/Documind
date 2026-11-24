import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localeDetection: false,
  // The HTML <link rel="alternate" hreflang> tags emitted by page metadata are
  // the single source of truth; the middleware Link header would disagree on
  // x-default.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
