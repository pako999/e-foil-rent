import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.e-foiling.si";

  return {
    rules: [
      // Public search engines: everything except admin/api.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      // Explicitly named AI crawlers — allowed so the site is indexable
      // for ChatGPT search, Claude, Perplexity and Google AI Overviews.
      // Reverse the `allow` below if you want to opt out of AI training.
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Google-Extended", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: "Bytespider", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
