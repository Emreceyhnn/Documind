import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const ACCESS_TOKEN_COOKIE = "documind_access_token";
const REFRESH_TOKEN_COOKIE = "documind_refresh_token";

const PROTECTED_PATHS = ["/docs", "/chat", "/settings"];

const intlMiddleware = createMiddleware(routing);

function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/([a-zA-Z-]+)(\/.*)?$/);
  if (match && routing.locales.includes(match[1] as (typeof routing.locales)[number])) {
    return match[2] ?? "/";
  }
  return pathname;
}

export function proxy(request: NextRequest) {
  const pathnameWithoutLocale = stripLocale(request.nextUrl.pathname);
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathnameWithoutLocale === path || pathnameWithoutLocale.startsWith(`${path}/`)
  );

  if (isProtected) {
    const hasSession =
      request.cookies.has(ACCESS_TOKEN_COOKIE) ||
      request.cookies.has(REFRESH_TOKEN_COOKIE);

    if (!hasSession) {
      const localeMatch = request.nextUrl.pathname.match(/^\/([a-zA-Z-]+)(\/.*)?$/);
      const locale =
        localeMatch && routing.locales.includes(localeMatch[1] as (typeof routing.locales)[number])
          ? localeMatch[1]
          : routing.defaultLocale;

      const signInUrl = new URL(`/${locale}/auth/sign-in`, request.url);
      signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|icon|favicon.ico|.*\\..*).*)"],
};
