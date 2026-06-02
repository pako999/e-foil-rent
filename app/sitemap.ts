import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://efoil.surf-store.com";
  const now = new Date();
  return [
    {
      url: `${base}/sl`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { sl: `${base}/sl`, en: `${base}/en` } },
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { sl: `${base}/sl`, en: `${base}/en` } },
    },
  ];
}
