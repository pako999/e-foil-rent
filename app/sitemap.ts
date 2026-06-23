import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { LEGAL_PAGES } from "@/lib/content";
import { COURSES_SLUG } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.e-foiling.si";
  const now = new Date();

  const languages = {
    sl: `${base}/sl`,
    en: `${base}/en`,
    de: `${base}/de`,
  } as const;

  /**
   * Build three sitemap entries for a logical page (one per locale) with
   * BCP47 hreflang alternates. The `pathFor` callback returns the
   * locale-specific URL fragment so localised slugs are emitted —
   * e.g. /sl/tecaji vs /en/courses vs /de/kurse.
   */
  const make = (
    pathFor: (locale: "sl" | "en" | "de") => string,
    priority: number,
    lastMod: Date = now,
  ) => {
    const langs = {
      "sl-SI": `${languages.sl}${pathFor("sl")}`,
      "en-GB": `${languages.en}${pathFor("en")}`,
      "de-DE": `${languages.de}${pathFor("de")}`,
    };
    return [
      {
        url: langs["sl-SI"],
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages: langs },
      },
      {
        url: langs["en-GB"],
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: Math.max(0.1, priority - 0.1),
        alternates: { languages: langs },
      },
      {
        url: langs["de-DE"],
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: Math.max(0.1, priority - 0.1),
        alternates: { languages: langs },
      },
    ];
  };

  const samePath = (path: string) => () => path;

  const staticEntries = [
    ...make(samePath(""), 1),
    ...make((l) => `/${COURSES_SLUG[l]}`, 0.95),
    ...make(samePath("/efoil"), 0.9),
    ...make(samePath("/blog"), 0.9),
    ...make(samePath("/duotone"), 0.8),
  ];

  const blogEntries = BLOG_POSTS.flatMap((post) =>
    make((l) => `/blog/${post.slugs[l]}`, 0.7, new Date(post.publishedAt)),
  );

  const legalEntries = LEGAL_PAGES.flatMap((slug) =>
    make(samePath(`/legal/${slug}`), 0.3),
  );

  return [...staticEntries, ...blogEntries, ...legalEntries];
}
