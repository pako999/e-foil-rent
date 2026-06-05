import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { LEGAL_PAGES } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";
  const now = new Date();

  const languages = {
    sl: `${base}/sl`,
    en: `${base}/en`,
    de: `${base}/de`,
  } as const;

  const make = (path: string, priority: number, lastMod: Date = now) => {
    const langs = {
      sl: `${languages.sl}${path}`,
      en: `${languages.en}${path}`,
      de: `${languages.de}${path}`,
    };
    return [
      {
        url: langs.sl,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority,
        alternates: { languages: langs },
      },
      {
        url: langs.en,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: Math.max(0.1, priority - 0.1),
        alternates: { languages: langs },
      },
      {
        url: langs.de,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: Math.max(0.1, priority - 0.1),
        alternates: { languages: langs },
      },
    ];
  };

  const staticEntries = [
    ...make("", 1),
    ...make("/tecaji", 0.95),
    ...make("/efoil", 0.9),
    ...make("/blog", 0.9),
    ...make("/duotone", 0.8),
  ];

  const blogEntries = BLOG_POSTS.flatMap((post) =>
    make(`/blog/${post.slug}`, 0.7, new Date(post.publishedAt)),
  );

  const legalEntries = LEGAL_PAGES.flatMap((slug) =>
    make(`/legal/${slug}`, 0.3),
  );

  return [...staticEntries, ...blogEntries, ...legalEntries];
}
