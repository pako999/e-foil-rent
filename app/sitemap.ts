import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";
  const now = new Date();
  const langs = { sl: `${base}/sl`, en: `${base}/en` };

  const make = (path: string, priority: number) => [
    {
      url: `${base}/sl${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: { sl: `${base}/sl${path}`, en: `${base}/en${path}` },
      },
    },
    {
      url: `${base}/en${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: priority - 0.1,
      alternates: {
        languages: { sl: `${base}/sl${path}`, en: `${base}/en${path}` },
      },
    },
  ];

  void langs;
  return [
    ...make("", 1),
    ...make("/tecaji", 0.95),
    ...make("/efoil", 0.9),
    ...make("/duotone", 0.8),
  ];
}
