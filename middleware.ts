import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/request";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  // We do our own geo-based redirect below; let the intl middleware only
  // handle requests that already carry a locale prefix or a NEXT_LOCALE
  // cookie.
  localeDetection: false,
});

const localePrefix = new RegExp(`^/(${locales.join("|")})(/|$)`);

/**
 * Pick a locale for a fresh visitor:
 * - SI IP → Slovenian
 * - everything else → English
 *
 * Vercel injects `x-vercel-ip-country` on production. Locally / on
 * self-hosted nodes that header is empty, so we fall through to the
 * configured default (sl).
 */
function pickLocale(req: NextRequest): "sl" | "en" {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    "";
  if (country.toUpperCase() === "SI") return "sl";
  // No geo signal at all → use the configured default so we don't ship a
  // dev-mode visitor to /en accidentally.
  if (!country) return defaultLocale as "sl" | "en";
  return "en";
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already locale-prefixed → hand off to next-intl.
  if (localePrefix.test(pathname)) {
    return intlMiddleware(req);
  }

  // User has manually picked a language before → respect their cookie.
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Fresh visitor → geo-based redirect.
  const target = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
