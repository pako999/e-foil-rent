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

// Detected via User-Agent. Crawlers from these tools should crawl the
// Slovenian version as the primary one — they typically hit the site
// from US IPs which the geo logic would otherwise send to /en, causing
// Google to index the English version as the canonical homepage.
const BOT_UA =
  /Googlebot|Google-InspectionTool|Bingbot|AdsBot|Slurp|DuckDuckBot|Yandex|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|GPTBot|ClaudeBot|PerplexityBot|CCBot|Bytespider/i;

/**
 * Pick a locale for a fresh visitor:
 * - Search-engine / social bot → defaultLocale (so Slovenian is indexed
 *   as the primary version regardless of crawl-IP geography)
 * - SI IP → Slovenian
 * - DE / AT / CH IP → German
 * - everything else → English
 *
 * Vercel injects `x-vercel-ip-country` on production. Locally / on
 * self-hosted nodes that header is empty, so we fall through to the
 * configured default (sl).
 */
function pickLocale(req: NextRequest): "sl" | "en" | "de" {
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_UA.test(ua)) return defaultLocale as "sl" | "en" | "de";

  const country = (
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    ""
  ).toUpperCase();
  if (country === "SI") return "sl";
  if (country === "DE" || country === "AT" || country === "CH") return "de";
  // No geo signal at all → use the configured default so we don't ship a
  // dev-mode visitor to /en accidentally.
  if (!country) return defaultLocale as "sl" | "en" | "de";
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
