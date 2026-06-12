import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { LEGAL_PAGES } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.e-foiling.si";
  const now = new Date();

  const languages = {
    sl: `${base}/sl`,
    en: `${base}/en`,
    de: `${base}/de`,
  } as const;

  const make = (path: string, priority: number, lastMod: Date = now) => {
    // BCP47 keys (sl-SI / en-GB / de-DE) so Google maps the alternates to
    // regional searchers — bare "sl" is technically valid but a weaker
    // localisation signal than the language-region pair.
    const langs = {
      "sl-SI": `${languages.sl}${path}`,
      "en-GB": `${languages.en}${path}`,
      "de-DE": `${languages.de}${path}`,
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
