export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StickyBookBar } from "../components/StickyBookBar";
import { StoreBanner } from "../components/StoreBanner";
import { SITE } from "@/lib/content";
import { locales, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "efoil.meta" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `/${locale}/efoil`,
      languages: {
        sl: "/sl/efoil",
        en: "/en/efoil",
        "x-default": "/sl/efoil",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "article",
      url: `${siteUrl}/${locale}/efoil`,
      siteName: "Surf-Store.com",
      locale: locale === "sl" ? "sl_SI" : "en_GB",
      images: [
        { url: "/action-1.jpg", width: 1200, height: 630, alt: "E-foil ride" },
      ],
    },
  };
}

const HOW_KEYS = ["board", "foil", "motor", "battery"] as const;
const WHY_KEYS = ["silent", "noWaves", "clean", "learn", "range", "ages"] as const;
const LEARN_KEYS = ["s1", "s2", "s3", "s4"] as const;
const SAFETY_KEYS = ["helmet", "vest", "leash", "wetsuit", "first", "prop"] as const;
const SPEC_KEYS = ["speed", "range", "battery", "charge", "weight", "rider", "mast", "wing"] as const;

export default async function EfoilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("efoil");
  const tMeta = await getTranslations("efoil.meta");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  // Article + FAQ schema for richer Google results.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: tMeta("title"),
    description: tMeta("description"),
    inLanguage: locale === "sl" ? "sl-SI" : "en-GB",
    author: { "@type": "Organization", name: "Surf-Store.com" },
    publisher: {
      "@type": "Organization",
      name: "Surf-Store.com",
      url: SITE.mainSite,
    },
    mainEntityOfPage: `${siteUrl}/${locale}/efoil`,
    image: `${siteUrl}/action-1.jpg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header locale={locale as Locale} />
      <main>
        {/* HERO */}
        <section className="relative bg-ink text-paper border-b-2 border-ink overflow-hidden min-h-[55vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/action-1.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/85" />
          </div>
          <div className="relative container-x py-16 md:py-24">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-6 border-2 border-gold px-3 py-1.5">
              ⚡ // {t("hero.eyebrow")}
            </p>
            <h1 className="h-display text-7xl sm:text-8xl md:text-9xl text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-paper/90 text-xl max-w-3xl leading-snug">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}#book`} className="btn-primary">
                {t("hero.ctaRent")} →
              </Link>
              <a
                href={SITE.shop}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                {t("hero.ctaBuy")}
              </a>
            </div>
          </div>
        </section>

        {/* WHAT IS AN E-FOIL */}
        <section className="bg-paper border-b-2 border-ink">
          <article className="container-x py-20 max-w-3xl">
            <p className="eyebrow mb-3">// {t("what.eyebrow")}</p>
            <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-6">
              {t("what.title")}
            </h2>
            <p className="text-graphite text-xl leading-relaxed mb-6 font-medium">
              {t("what.lead")}
            </p>
            <p className="text-graphite text-lg leading-relaxed mb-4">
              {t("what.p1")}
            </p>
            <p className="text-graphite text-lg leading-relaxed">
              {t("what.p2")}
            </p>
          </article>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-cream border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">⚙ // {t("how.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("how.title")}
              </h2>
              <p className="text-graphite text-lg">{t("how.subtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {HOW_KEYS.map((k, i) => (
                <article
                  key={k}
                  className="bg-paper border-2 border-ink p-6 flex items-start gap-4"
                >
                  <span className="shrink-0 w-12 h-12 bg-ink text-gold flex items-center justify-center font-display text-xl" style={{ fontWeight: 900 }}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display uppercase tracking-tight text-xl text-ink mb-1" style={{ fontWeight: 900 }}>
                      {t(`how.items.${k}.title`)}
                    </h3>
                    <p className="text-graphite text-sm">
                      {t(`how.items.${k}.body`)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHY POPULAR */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">// {t("why.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
                {t("why.title")}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHY_KEYS.map((k) => (
                <article
                  key={k}
                  className="border-2 border-ink p-5 bg-cream hover:bg-gold transition-colors"
                >
                  <h3 className="font-display uppercase tracking-tight text-lg text-ink mb-2" style={{ fontWeight: 900 }}>
                    {t(`why.items.${k}.title`)}
                  </h3>
                  <p className="text-graphite text-sm">
                    {t(`why.items.${k}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FOR WHOM */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-[1fr,1.4fr] gap-12 items-start">
            <div>
              <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
                👥 // {t("forWhom.eyebrow")}
              </p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">
                {t("forWhom.title")}
              </h2>
            </div>
            <ul className="space-y-5 text-paper/85 text-lg leading-relaxed">
              {(["p1", "p2", "p3", "p4"] as const).map((k) => (
                <li key={k} className="flex gap-3">
                  <span className="text-gold shrink-0 mt-1">▶</span>
                  <span>{t(`forWhom.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* LEARNING CURVE */}
        <section className="bg-cream border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">📈 // {t("learning.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("learning.title")}
              </h2>
              <p className="text-graphite text-lg">{t("learning.subtitle")}</p>
            </div>
            <ol className="space-y-3">
              {LEARN_KEYS.map((k, i) => (
                <li
                  key={k}
                  className="grid md:grid-cols-[120px,160px,1fr] gap-4 items-start bg-paper border-2 border-ink p-5"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/60 bg-gold border-2 border-ink px-2 py-1 w-fit">
                    {t(`learning.steps.${k}.min`)}
                  </span>
                  <h3 className="font-display uppercase tracking-tight text-xl text-ink" style={{ fontWeight: 900 }}>
                    {String(i + 1).padStart(2, "0")} · {t(`learning.steps.${k}.title`)}
                  </h3>
                  <p className="text-graphite">{t(`learning.steps.${k}.body`)}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-display uppercase text-sm text-ink border-l-4 border-gold pl-4 italic" style={{ fontWeight: 700 }}>
              ✦ {t("learning.tip")}
            </p>
          </div>
        </section>

        {/* SAFETY */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow mb-3">🛟 // {t("safety.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-6">
                {t("safety.title")}
              </h2>
              <p className="text-graphite text-base mt-6 border-l-4 border-ink pl-4">
                {t("safety.note")}
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {SAFETY_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-2 text-ink">
                  <span className="w-6 h-6 mt-0.5 shrink-0 bg-ink text-gold flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <span className="text-sm">{t(`safety.items.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SPECS */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-20 grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
            <div>
              <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
                📐 // {t("specs.eyebrow")}
              </p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl mb-3">
                {t("specs.title")}
              </h2>
              <p className="text-paper/75 text-lg mb-6">{t("specs.subtitle")}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href={`/${locale}#specs`}
                  className="font-display uppercase text-sm tracking-wide text-gold border-b-2 border-gold pb-1 hover:text-gold-light"
                  style={{ fontWeight: 800 }}
                >
                  {t("specs.linkSpecs")}
                </Link>
                <Link
                  href={`/${locale}/duotone`}
                  className="font-display uppercase text-sm tracking-wide text-gold border-b-2 border-gold pb-1 hover:text-gold-light"
                  style={{ fontWeight: 800 }}
                >
                  {t("specs.linkDuotone")}
                </Link>
              </div>
            </div>
            <dl className="border-2 border-gold divide-y-2 divide-gold/30">
              {SPEC_KEYS.map((k) => (
                <div key={k} className="px-5 py-3 font-mono text-sm text-paper">
                  {t(`specs.items.${k}`)}
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* RENT/BUY CTA */}
        <section className="bg-gold border-b-2 border-ink">
          <div className="container-x py-16 grid md:grid-cols-[1.5fr,auto] gap-8 items-center">
            <div>
              <p className="eyebrow mb-2">🛒 // {t("rent.eyebrow")}</p>
              <h2 className="h-display text-3xl sm:text-4xl md:text-5xl text-ink mb-3">
                {t("rent.title")}
              </h2>
              <p className="text-ink text-lg max-w-xl">{t("rent.body")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}#book`} className="btn-ghost">
                {t("rent.ctaRent")} →
              </Link>
              <a
                href={SITE.shop}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                {t("rent.ctaShop")} ↗
              </a>
            </div>
          </div>
        </section>

        <StoreBanner />
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
