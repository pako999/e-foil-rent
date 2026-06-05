import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["sl", "en", "de"] as const;
export const defaultLocale = "sl" as const;
export type Locale = (typeof locales)[number];

const INTL_BCP47: Record<Locale, string> = {
  sl: "sl-SI",
  en: "en-GB",
  de: "de-DE",
};

const OG_LOCALE: Record<Locale, string> = {
  sl: "sl_SI",
  en: "en_GB",
  de: "de_DE",
};

export function intlLocale(locale: Locale): string {
  return INTL_BCP47[locale];
}

export function ogLocale(locale: Locale): string {
  return OG_LOCALE[locale];
}

export function langAlternates(path: string): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as Locale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return { locale, messages };
});
