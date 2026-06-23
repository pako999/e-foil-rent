// Static at build time — pure content + translations; no DB reads.
export const revalidate = 3600;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { StickyBookBar } from "../components/StickyBookBar";
import { StoreBanner } from "../components/StoreBanner";
import { BLOG_POSTS, localizeBlog, slugFor } from "@/lib/blog-posts";
import { locales, ogLocale, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.e-foiling.si";

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        "sl-SI": "/sl/blog",
        "en-GB": "/en/blog",
        "de-DE": "/de/blog",
        "x-default": "/sl/blog",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `${siteUrl}/${locale}/blog`,
      siteName: "Surf-Store.com",
      locale: ogLocale(locale as Locale),
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("blog");

  const posts = [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const [featured, ...rest] = posts;
  const featuredC = localizeBlog(featured, locale as Locale);

  return (
    <>
      <Header locale={locale as Locale} />
      <main>
        {/* HERO */}
        <section className="bg-ink text-paper border-b-2 border-ink">
          <div className="container-x py-16 md:py-20">
            <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
              📝 // {t("eyebrow")}
            </p>
            <h1 className="h-display text-5xl sm:text-6xl md:text-7xl">{t("title")}</h1>
            <p className="mt-4 text-paper/85 text-lg max-w-2xl">{t("subtitle")}</p>
          </div>
        </section>

        {/* FEATURED */}
        {featured && (
          <section className="bg-paper border-b-2 border-ink">
            <div className="container-x py-12">
              <Link
                href={`/${locale}/blog/${slugFor(featured, locale as Locale)}`}
                className="grid md:grid-cols-2 border-2 border-ink overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
              >
                <div className="relative aspect-[4/3] md:aspect-auto bg-cream border-b-2 md:border-b-0 md:border-r-2 border-ink overflow-hidden">
                  <Image
                    src={featured.cover.src}
                    alt={featured.cover.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-gold border-2 border-ink text-ink font-display uppercase text-xs px-2 py-1 tracking-widest" style={{ fontWeight: 800 }}>
                    {t(`categories.${featured.category}`)}
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="font-mono text-xs text-mute mb-2">
                    {featured.publishedAt} · {t("readingTime", { minutes: featured.readingMinutes })}
                  </p>
                  <h2 className="font-display uppercase tracking-tight text-3xl md:text-4xl text-ink mb-3" style={{ fontWeight: 900 }}>
                    {featuredC.title}
                  </h2>
                  <p className="text-graphite mb-6">
                    {featuredC.excerpt}
                  </p>
                  <span className="font-display uppercase text-sm tracking-wide text-ink border-b-2 border-gold pb-1 w-fit" style={{ fontWeight: 800 }}>
                    {t("readMore")} →
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* GRID */}
        {rest.length > 0 && (
          <section className="bg-cream border-b-2 border-ink">
            <div className="container-x py-16">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => {
                  const c = localizeBlog(post, locale as Locale);
                  return (
                    <Link
                      key={post.slugs.sl}
                      href={`/${locale}/blog/${slugFor(post, locale as Locale)}`}
                      className="card card-hover flex flex-col bg-paper"
                    >
                      <div className="aspect-[4/3] bg-cream relative overflow-hidden border-b-2 border-ink">
                        <Image
                          src={post.cover.src}
                          alt={post.cover.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-gold border-2 border-ink text-ink font-display uppercase text-xs px-2 py-1 tracking-widest" style={{ fontWeight: 800 }}>
                          {t(`categories.${post.category}`)}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="font-mono text-xs text-mute mb-2">
                          {post.publishedAt} · {t("readingTime", { minutes: post.readingMinutes })}
                        </p>
                        <h2 className="font-display uppercase tracking-tight text-xl text-ink mb-3" style={{ fontWeight: 900 }}>
                          {c.title}
                        </h2>
                        <p className="text-graphite text-sm flex-1 mb-4">
                          {c.excerpt}
                        </p>
                        <span className="font-display uppercase text-xs tracking-wide text-ink border-b-2 border-gold pb-1 w-fit" style={{ fontWeight: 800 }}>
                          {t("readMore")} →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <StoreBanner />
      </main>
      <Footer locale={locale as Locale} />
      <StickyBookBar />
    </>
  );
}
