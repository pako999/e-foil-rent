export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StickyBookBar } from "../components/StickyBookBar";
import { StoreBanner } from "../components/StoreBanner";
import { locales, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/content";

const WHY_KEYS = ["fast", "safe", "feedback", "gear"] as const;
const LEVEL_KEYS = ["beginner", "intermediate", "private"] as const;
const STEP_KEYS = ["s1", "s2", "s3", "s4", "s5"] as const;
const INCLUDED_KEYS = ["board", "battery", "safety", "wetsuit", "insurance", "photos"] as const;
const LOCATION_KEYS = ["greenLake", "ms", "kamesnica", "maribor"] as const;
const FAQ_KEYS = ["needSwim", "ageMin", "group", "weather", "gift"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "tecaji.meta" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `/${locale}/tecaji`,
      languages: {
        sl: "/sl/tecaji",
        en: "/en/tecaji",
        "x-default": "/sl/tecaji",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "article",
      url: `${siteUrl}/${locale}/tecaji`,
      siteName: "Surf-Store.com",
      locale: locale === "sl" ? "sl_SI" : "en_GB",
      images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "E-foil course" }],
    },
  };
}

export default async function TecajiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("tecaji");
  const tMeta = await getTranslations("tecaji.meta");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";

  // Course schema for rich snippets in Google.
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: tMeta("title"),
    description: tMeta("description"),
    inLanguage: locale === "sl" ? "sl-SI" : "en-GB",
    provider: {
      "@type": "Organization",
      name: "Surf-Store.com",
      url: SITE.mainSite,
      sameAs: SITE.mainSite,
    },
    url: `${siteUrl}/${locale}/tecaji`,
    image: `${siteUrl}/hero.jpg`,
    hasCourseInstance: LEVEL_KEYS.map((k) => ({
      "@type": "CourseInstance",
      name: t(`levels.items.${k}.name`),
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: "Green Lake, Kidričevo",
        address: { "@type": "PostalAddress", addressCountry: "SI" },
      },
    })),
  };

  // FAQ schema for the FAQ section.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((k) => ({
      "@type": "Question",
      name: t(`faq.items.${k}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.items.${k}.a`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header locale={locale as Locale} />
      <main>
        {/* HERO */}
        <section className="relative bg-ink text-paper border-b-2 border-ink overflow-hidden min-h-[60vh] min-h-[60svh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/30" />
          </div>
          <div className="relative container-x py-16 md:py-24">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-6 border-2 border-gold px-3 py-1.5 bg-ink/40 backdrop-blur-sm">
              🎓 // {t("hero.eyebrow")}
            </p>
            <h1 className="h-display text-6xl sm:text-7xl md:text-8xl text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-paper/90 text-lg sm:text-xl max-w-3xl leading-snug">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}#book`} className="btn-primary">
                {t("hero.ctaBook")} →
              </Link>
              <a href="#levels" className="btn-secondary">
                {t("hero.ctaScroll")}
              </a>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow mb-3">// {t("why.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
                {t("why.title")}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WHY_KEYS.map((k) => (
                <article key={k} className="border-2 border-ink p-5 bg-cream hover:bg-gold transition-colors">
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

        {/* COURSE LEVELS */}
        <section id="levels" className="bg-cream border-b-2 border-ink scroll-mt-20">
          <div className="container-x py-20">
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow mb-3">📚 // {t("levels.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("levels.title")}
              </h2>
              <p className="text-graphite text-lg">{t("levels.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {LEVEL_KEYS.map((k, i) => (
                <article
                  key={k}
                  className={`card card-hover p-6 flex flex-col ${i === 1 ? "bg-gold" : "bg-paper"}`}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink/60 border-2 border-ink px-2 py-0.5">
                      {t(`levels.items.${k}.duration`)}
                    </span>
                    <span className="text-3xl">{["🎯", "🌊", "👤"][i]}</span>
                  </div>
                  <h3 className="font-display uppercase tracking-tight text-2xl text-ink mb-2" style={{ fontWeight: 900 }}>
                    {t(`levels.items.${k}.name`)}
                  </h3>
                  <p className="text-graphite text-sm mb-4 italic">
                    {t(`levels.items.${k}.target`)}
                  </p>
                  <div className="mb-5 pb-5 border-b-2 border-ink/15">
                    <p className="font-display text-4xl text-ink leading-none" style={{ fontWeight: 900 }}>
                      {t(`levels.items.${k}.price`)}
                    </p>
                    <p className="font-mono text-xs text-ink/70 mt-2">
                      {t(`levels.items.${k}.priceNote`)}
                    </p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-ink">
                        <span className="w-5 h-5 mt-0.5 shrink-0 bg-ink text-gold flex items-center justify-center font-bold text-xs">
                          ✓
                        </span>
                        {t(`levels.items.${k}.${f}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}#book`}
                    className={i === 1 ? "btn-ghost" : "btn-primary"}
                  >
                    {t("hero.ctaBook")} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU LEARN — 5-step programme */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">// {t("what.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("what.title")}
              </h2>
              <p className="text-graphite text-lg">{t("what.subtitle")}</p>
            </div>
            <ol className="grid md:grid-cols-5 gap-3">
              {STEP_KEYS.map((k, i) => (
                <li key={k} className="border-2 border-ink p-5 bg-cream relative">
                  <span className="absolute -top-3 -left-2 font-display text-4xl text-ink bg-gold border-2 border-ink px-2 leading-none" style={{ fontWeight: 900 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-ink mt-4">{t(`what.steps.${k}`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* INSTRUCTOR */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-[1fr,1.4fr] gap-12 items-start">
            <div>
              <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
                👨‍🏫 // {t("instructor.eyebrow")}
              </p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">{t("instructor.title")}</h2>
            </div>
            <div className="space-y-4 text-paper/85 text-lg leading-relaxed">
              <p>{t("instructor.p1")}</p>
              <p>{t("instructor.p2")}</p>
              <p>{t("instructor.p3")}</p>
            </div>
          </div>
        </section>

        {/* INCLUDED */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">📦 // {t("included.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
                {t("included.title")}
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INCLUDED_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-3 border-2 border-ink p-4 bg-cream">
                  <span className="w-6 h-6 mt-0.5 shrink-0 bg-ink text-gold flex items-center justify-center font-bold text-sm">✓</span>
                  <span className="text-ink">{t(`included.items.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="bg-cream border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">📍 // {t("locations.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("locations.title")}
              </h2>
              <p className="text-graphite text-lg">{t("locations.subtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {LOCATION_KEYS.map((k) => (
                <article key={k} className="border-2 border-ink p-5 bg-paper">
                  <h3 className="font-display uppercase tracking-tight text-xl text-ink mb-1" style={{ fontWeight: 900 }}>
                    {t(`locations.items.${k}.name`)}
                  </h3>
                  <p className="text-graphite text-sm">
                    {t(`locations.items.${k}.note`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20 max-w-3xl">
            <div className="mb-10">
              <p className="eyebrow mb-3">// {t("faq.eyebrow")}</p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
                {t("faq.title")}
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ_KEYS.map((k) => (
                <details key={k} className="group bg-cream border-2 border-ink overflow-hidden">
                  <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 font-display uppercase tracking-wide text-ink group-open:bg-gold transition-colors" style={{ fontWeight: 800 }}>
                    <span>{t(`faq.items.${k}.q`)}</span>
                    <span className="shrink-0 w-7 h-7 bg-ink text-gold flex items-center justify-center transition group-open:rotate-45">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-4 h-4">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 py-5 text-graphite leading-relaxed border-t-2 border-ink">
                    {t(`faq.items.${k}.a`)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gold border-b-2 border-ink">
          <div className="container-x py-16 grid md:grid-cols-[1.4fr,auto] items-center gap-8">
            <div>
              <h2 className="h-display text-3xl sm:text-4xl md:text-5xl text-ink mb-3">
                {t("cta.title")}
              </h2>
              <p className="text-ink text-lg max-w-xl">{t("cta.body")}</p>
            </div>
            <Link href={`/${locale}#book`} className="btn-ghost whitespace-nowrap">
              {t("cta.button")} →
            </Link>
          </div>
        </section>

        <StoreBanner />
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
