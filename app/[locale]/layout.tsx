import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, ogLocale, type Locale } from "@/i18n/request";
import { ConsentInit } from "./components/ConsentInit";
import { CookieBanner } from "./components/CookieBanner";
import { ExitIntentPopup } from "./components/ExitIntentPopup";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-foiling.si";

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    applicationName: "Surf-Store E-Foil",
    authors: [{ name: "Sport Group d.o.o.", url: siteUrl }],
    creator: "Sport Group d.o.o.",
    publisher: "Sport Group d.o.o.",
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        sl: "/sl",
        en: "/en",
        de: "/de",
        "x-default": "/sl",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `${siteUrl}/${locale}`,
      siteName: "Surf-Store.com — E-Foil",
      locale: ogLocale(locale as Locale),
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const viewport = {
  themeColor: "#FFD600",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Consent Mode v2 default state — must run before any
            analytics tag so vendors see a deterministic baseline. */}
        <ConsentInit />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&family=Sofia+Sans+Condensed:wght@700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <CookieBanner locale={locale as Locale} />
          <ExitIntentPopup locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
