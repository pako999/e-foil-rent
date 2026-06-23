import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { BLOG_POSTS } from "./lib/blog-posts";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.surf-store.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },

  /**
   * Localised slugs:
   * - File lives at /[locale]/tecaji and /[locale]/blog/[slug]
   * - Public URL is localised (/en/courses, /de/kurse, /en/blog/what-is-an-efoil)
   *
   * `rewrites` map the public URL → the canonical file (internal, URL
   * stays localised). `redirects` 308 the old single-language slugs to
   * the localised ones so Google merges signals onto one canonical per
   * locale.
   */
  async rewrites() {
    const blog = BLOG_POSTS.flatMap((p) =>
      [
        p.slugs.en !== p.slugs.sl
          ? {
              source: `/en/blog/${p.slugs.en}`,
              destination: `/en/blog/${p.slugs.sl}`,
            }
          : null,
        p.slugs.de !== p.slugs.sl
          ? {
              source: `/de/blog/${p.slugs.de}`,
              destination: `/de/blog/${p.slugs.sl}`,
            }
          : null,
      ].filter((r): r is { source: string; destination: string } => r !== null),
    );

    return [
      { source: "/en/courses", destination: "/en/tecaji" },
      { source: "/de/kurse", destination: "/de/tecaji" },
      ...blog,
    ];
  },

  async redirects() {
    const blog = BLOG_POSTS.flatMap((p) =>
      [
        p.slugs.en !== p.slugs.sl
          ? {
              source: `/en/blog/${p.slugs.sl}`,
              destination: `/en/blog/${p.slugs.en}`,
              permanent: true,
            }
          : null,
        p.slugs.de !== p.slugs.sl
          ? {
              source: `/de/blog/${p.slugs.sl}`,
              destination: `/de/blog/${p.slugs.de}`,
              permanent: true,
            }
          : null,
      ].filter(
        (r): r is { source: string; destination: string; permanent: true } =>
          r !== null,
      ),
    );

    return [
      { source: "/en/tecaji", destination: "/en/courses", permanent: true },
      { source: "/de/tecaji", destination: "/de/kurse", permanent: true },
      ...blog,
    ];
  },
};

export default withNextIntl(nextConfig);
