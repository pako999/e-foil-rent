export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { StickyBookBar } from "../../components/StickyBookBar";
import { StoreBanner } from "../../components/StoreBanner";
import {
  BLOG_POSTS,
  getPostBySlug,
  localizeBlog,
  type BlogBlock,
  type BlogPost,
} from "@/lib/blog-posts";
import { locales, intlLocale, ogLocale, type Locale } from "@/i18n/request";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const c = localizeBlog(post, locale as Locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-foiling.si";

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        sl: `/sl/blog/${slug}`,
        en: `/en/blog/${slug}`,
        de: `/de/blog/${slug}`,
        "x-default": `/sl/blog/${slug}`,
      },
    },
    openGraph: {
      title: c.title,
      description: c.excerpt,
      type: "article",
      url: `${siteUrl}/${locale}/blog/${slug}`,
      siteName: "Surf-Store.com",
      locale: ogLocale(locale as Locale),
      publishedTime: post.publishedAt,
      images: [
        { url: post.cover.src, width: 1200, height: 630, alt: post.cover.alt },
      ],
    },
  };
}

function Block({ block, locale }: { block: BlogBlock; locale: Locale }) {
  switch (block.kind) {
    case "p":
      return (
        <p className="text-graphite text-xl sm:text-lg leading-relaxed mb-5">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2
          className="font-display uppercase tracking-tight text-2xl sm:text-3xl text-ink mt-12 mb-4"
          style={{ fontWeight: 900 }}
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          className="font-display uppercase tracking-tight text-xl text-ink mt-8 mb-3"
          style={{ fontWeight: 800 }}
        >
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="space-y-2 mb-6 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-graphite text-xl sm:text-lg">
              <span className="w-5 h-5 mt-1 shrink-0 bg-gold border-2 border-ink" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-3 mb-6 ml-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-graphite text-xl sm:text-lg">
              <span className="shrink-0 w-7 h-7 bg-ink text-gold flex items-center justify-center font-display text-sm" style={{ fontWeight: 900 }}>
                {i + 1}
              </span>
              <span className="pt-1">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-gold pl-5 italic text-ink text-xl">
          “{block.text}”
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-8">
          <div
            className="relative aspect-video border-2 border-ink overflow-hidden"
            style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}
          >
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 font-mono text-xs text-mute text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "cta":
      return (
        <div className="my-10 border-2 border-ink bg-gold p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-display uppercase tracking-tight text-xl text-ink" style={{ fontWeight: 800 }}>
            {block.text}
          </p>
          {block.href.startsWith("http") ? (
            <a
              href={block.href}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost whitespace-nowrap"
            >
              {block.label} ↗
            </a>
          ) : (
            <Link
              href={`/${locale}${block.href}`}
              className="btn-ghost whitespace-nowrap"
            >
              {block.label} →
            </Link>
          )}
        </div>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const t = await getTranslations("blog");
  const c = localizeBlog(post, locale as Locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-foiling.si";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.metaTitle,
    description: c.metaDescription,
    inLanguage: intlLocale(locale as Locale),
    image: `${siteUrl}${post.cover.src}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "Surf-Store.com" },
    publisher: {
      "@type": "Organization",
      name: "Surf-Store.com",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-surfstore.png` },
    },
    mainEntityOfPage: `${siteUrl}/${locale}/blog/${slug}`,
    articleSection: t(`categories.${post.category}`),
  };

  const related: BlogPost[] = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 2);
  const fallback = related.length === 0
    ? BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)
    : related;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Header locale={locale as Locale} />
      <main>
        {/* COVER HERO */}
        <section className="relative bg-ink text-paper border-b-2 border-ink overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={post.cover.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-ink/30" />
          </div>
          <div className="relative container-x py-16 md:py-24 max-w-4xl">
            <Link
              href={`/${locale}/blog`}
              className="inline-block font-mono text-xs text-gold border-b border-gold mb-6 hover:text-paper"
            >
              {t("backToBlog")}
            </Link>
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-4 border-2 border-gold px-3 py-1 bg-ink/40 backdrop-blur-sm">
              {t(`categories.${post.category}`)}
            </p>
            <h1 className="h-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              {c.title}
            </h1>
            <p className="mt-4 text-paper/85 text-base md:text-lg max-w-3xl">
              {c.excerpt}
            </p>
            <p className="mt-6 font-mono text-xs text-paper/70">
              {t("publishedOn")} {post.publishedAt} · {t("readingTime", { minutes: post.readingMinutes })}
            </p>
          </div>
        </section>

        {/* BODY */}
        <article className="bg-paper border-b-2 border-ink">
          <div className="container-x py-12 max-w-3xl">
            {c.blocks.map((block, i) => (
              <Block key={i} block={block} locale={locale as Locale} />
            ))}
          </div>
        </article>

        {/* RELATED */}
        {fallback.length > 0 && (
          <section className="bg-cream border-b-2 border-ink">
            <div className="container-x py-16">
              <h2 className="h-display text-3xl md:text-4xl text-ink mb-8">
                {t("relatedTitle")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {fallback.map((p) => {
                  const rc = localizeBlog(p, locale as Locale);
                  return (
                    <Link
                      key={p.slug}
                      href={`/${locale}/blog/${p.slug}`}
                      className="card card-hover flex flex-col bg-paper"
                    >
                      <div className="aspect-[4/3] bg-cream relative overflow-hidden border-b-2 border-ink">
                        <Image
                          src={p.cover.src}
                          alt={p.cover.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="font-mono text-xs text-mute mb-2">
                          {p.publishedAt}
                        </p>
                        <h3 className="font-display uppercase tracking-tight text-xl text-ink mb-2" style={{ fontWeight: 900 }}>
                          {rc.title}
                        </h3>
                        <p className="text-graphite text-sm flex-1">{rc.excerpt}</p>
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
