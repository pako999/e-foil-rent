export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StickyBookBar } from "../components/StickyBookBar";
import { Video } from "../components/Video";
import { DUOTONE_PRODUCTS, DUOTONE_VIDEOS, SITE } from "@/lib/content";
import { locales, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "duotone.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/duotone`,
      languages: {
        sl: "/sl/duotone",
        en: "/en/duotone",
        "x-default": "/sl/duotone",
      },
    },
  };
}

export default async function DuotonePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("duotone");

  return (
    <>
      <Header locale={locale as Locale} />
      <main>
        {/* HERO */}
        <section className="relative bg-ink text-paper border-b-2 border-ink overflow-hidden min-h-[60vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/action-2.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/85" />
          </div>
          <div className="relative container-x py-20">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-6 border-2 border-gold px-3 py-1.5">
              ★ // {t("hero.eyebrow")}
            </p>
            <h1 className="h-display text-6xl sm:text-7xl md:text-8xl text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              {t("hero.title")}
            </h1>
            <p className="mt-6 font-display uppercase text-xl md:text-2xl text-gold">
              {t("hero.tagline")}
            </p>
            <p className="mt-8 text-paper/85 text-lg max-w-3xl leading-relaxed">
              {t("hero.intro")}
            </p>
          </div>
        </section>

        {/* STORY */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-[1fr,1.4fr] gap-12 items-start">
            <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
              {t("story.title")}
            </h2>
            <div className="space-y-5 text-graphite text-lg leading-relaxed">
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <p className="font-display uppercase text-ink text-xl tracking-tight" style={{ fontWeight: 800 }}>
                {t("story.p3")}
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCT RANGE */}
        <section className="bg-cream border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-12 max-w-2xl">
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
                {t("range.title")}
              </h2>
              <p className="text-graphite text-lg">{t("range.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {DUOTONE_PRODUCTS.map((p) => (
                <article key={p.key} className="card card-hover flex flex-col">
                  <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden border-b-2 border-ink">
                    <Image
                      src={p.image}
                      alt={t(`range.items.${p.key}.name`)}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-gold border-2 border-ink text-ink font-mono text-xs px-3 py-1">
                      {t(`range.items.${p.key}.weight`)}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display uppercase tracking-tight text-2xl text-ink" style={{ fontWeight: 900 }}>
                      {t(`range.items.${p.key}.name`)}
                    </h3>
                    <p className="text-graphite mt-2 mb-6 flex-1 text-sm">
                      {t(`range.items.${p.key}.desc`)}
                    </p>
                    <a
                      href={p.shopUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary w-full"
                    >
                      {t(`range.items.${p.key}.cta`)} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MODULAR TECH */}
        <section className="bg-paper border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-6">
                {t("tech.title")}
              </h2>
              <div className="space-y-4 text-graphite text-lg leading-relaxed">
                <p>{t("tech.p1")}</p>
                <p>{t("tech.p2")}</p>
              </div>
              <Link
                href={`/${locale}#specs`}
                className="inline-block mt-8 font-display uppercase text-sm tracking-wide text-ink border-b-2 border-gold pb-1 hover:text-gold"
                style={{ fontWeight: 800 }}
              >
                {t("tech.specsLink")}
              </Link>
            </div>
            <div className="relative aspect-square border-2 border-ink overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #FFD600" }}>
              <Image
                src="/action-1.jpg"
                alt="Duotone foil modular system"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* VIDEOS */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-20">
            <div className="mb-10 max-w-2xl">
              <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
                ▶ // {t("videos.eyebrow")}
              </p>
              <h2 className="h-display text-4xl sm:text-5xl md:text-6xl">
                {t("videos.title")}
              </h2>
              <p className="text-paper/75 text-lg mt-3">{t("videos.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {DUOTONE_VIDEOS.map((vid) => (
                <div
                  key={vid}
                  className="aspect-video border-2 border-gold overflow-hidden"
                  style={{ boxShadow: "6px 6px 0 0 #FFD600" }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${vid}?rel=0`}
                    title={`Duotone video ${vid}`}
                    className="w-full h-full"
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
            <a
              href={SITE.duotoneYouTube}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              {t("videos.channelCta")}
            </a>
          </div>
        </section>

        {/* SHOP CTA */}
        <section className="bg-gold border-b-2 border-ink">
          <div className="container-x py-20 grid md:grid-cols-[1.4fr,auto] items-center gap-8">
            <div>
              <h2 className="h-display text-4xl md:text-5xl text-ink mb-4">
                {t("shop.title")}
              </h2>
              <p className="text-ink text-lg max-w-xl">{t("shop.body")}</p>
            </div>
            <a
              href={SITE.shop}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost whitespace-nowrap"
            >
              {t("shop.cta")}
            </a>
          </div>
        </section>
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
