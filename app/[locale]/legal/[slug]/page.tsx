// Static at build time — pure content + translations; no DB reads.
export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { StickyBookBar } from "../../components/StickyBookBar";
import { LEGAL_PAGES, SITE, type LegalSlug } from "@/lib/content";
import { locales, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";

function isLegalSlug(s: string): s is LegalSlug {
  return (LEGAL_PAGES as readonly string[]).includes(s);
}

// Pre-render every (locale, slug) legal page at build time.
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    LEGAL_PAGES.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  if (!isLegalSlug(slug)) notFound();
  const t = await getTranslations({ locale, namespace: `legal.${slug}.meta` });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/legal/${slug}`,
      languages: {
        "sl-SI": `/sl/legal/${slug}`,
        "en-GB": `/en/legal/${slug}`,
        "de-DE": `/de/legal/${slug}`,
        "x-default": `/sl/legal/${slug}`,
      },
    },
    robots: { index: true, follow: true },
  };
}

type Section = { title: string; body: string };

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  setRequestLocale(locale as Locale);
  const t = await getTranslations(`legal.${slug}`);
  const tCommon = await getTranslations("legal");
  const sections = (t.raw("sections") as Section[]) ?? [];

  return (
    <>
      <Header locale={locale as Locale} />
      <main>
        {/* HEADER STRIP */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-12 md:py-16 max-w-4xl">
            <Link
              href={`/${locale}`}
              className="inline-block font-mono text-xs text-gold border-b border-gold mb-4 hover:text-paper"
            >
              {tCommon("back")}
            </Link>
            <h1 className="h-display text-3xl sm:text-4xl md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 font-mono text-xs text-paper/60">
              {tCommon("updatedOn")}: {t("updatedAt")}
            </p>
          </div>
        </section>

        {/* BODY */}
        <article className="bg-paper border-b-2 border-ink">
          <div className="container-x py-12 max-w-3xl">
            <p className="text-graphite text-xl sm:text-lg leading-relaxed mb-8 italic border-l-4 border-gold pl-5">
              {t("intro")}
            </p>
            {sections.map((s, i) => (
              <section key={i} className="mb-8">
                <h2
                  className="font-display uppercase tracking-tight text-xl sm:text-2xl text-ink mb-3"
                  style={{ fontWeight: 900 }}
                >
                  {s.title}
                </h2>
                <p className="text-graphite leading-relaxed">{s.body}</p>
              </section>
            ))}

            {/* Company footer block */}
            <div className="mt-12 pt-6 border-t-2 border-ink/15">
              <p className="font-mono text-xs text-mute">
                {SITE.company.name} · {SITE.company.address}, {SITE.company.postal}, {SITE.company.country} · {SITE.company.vatId}
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
