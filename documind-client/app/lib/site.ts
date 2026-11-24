import { routing } from "@/i18n/routing";

const DEFAULT_SITE_URL = "https://documind.emreceyhan.xyz";

/**
 * Canonical public origin, without a trailing slash.
 * NEXT_PUBLIC_APP_URL is not set during the Docker build, so the fallback is
 * the production domain rather than localhost to keep sitemap/robots correct.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL
).replace(/\/+$/, "");

type ChangeFrequency = "weekly" | "monthly" | "yearly";

/**
 * Public, indexable pages (locale-less paths). Only list URLs that answer 200:
 * `/[lang]` itself just redirects to sign-in, so it is intentionally absent.
 * Add the locale root here once a real landing page replaces that redirect.
 */
export const PUBLIC_PAGES: ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}> = [
  { path: "/auth/sign-up", priority: 0.8, changeFrequency: "monthly" },
  { path: "/auth/sign-in", priority: 0.6, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
];

/** Locale-less path prefixes that require a session and must not be crawled. */
export const PRIVATE_PATHS = ["/docs", "/chat", "/settings"] as const;

export function localizedUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

export { routing };
