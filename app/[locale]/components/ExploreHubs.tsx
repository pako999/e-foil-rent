import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/request";
import { coursesPath } from "@/lib/routes";

type Hub = { key: string; href: (locale: Locale) => string; icon: string };

const HUBS: readonly Hub[] = [
  { key: "tecaji", href: (l) => coursesPath(l), icon: "🎓" },
  { key: "efoil", href: (l) => `/${l}/efoil`, icon: "⚡" },
  { key: "duotone", href: (l) => `/${l}/duotone`, icon: "★" },
  { key: "blog", href: (l) => `/${l}/blog`, icon: "📝" },
];

/**
 * "Explore" strip on the home page — in-body internal links to every sub-page.
 * Header nav alone carries less SEO weight than body anchors, and this gives
 * the crawler a clear hub-and-spoke map.
 */
export async function ExploreHubs({ locale }: { locale: Locale }) {
  const t = await getTranslations("explore");
  return (
    <section className="bg-cream border-b-2 border-ink">
      <div className="container-x py-16">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl text-ink">
            {t("title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HUBS.map((h) => (
            <Link
              key={h.key}
              href={h.href(locale)}
              className="card card-hover p-6 bg-paper flex flex-col gap-3"
            >
              <span className="text-4xl">{h.icon}</span>
              <h3
                className="font-display uppercase tracking-tight text-2xl text-ink"
                style={{ fontWeight: 900 }}
              >
                {t(`items.${h.key}.title`)}
              </h3>
              <p className="text-graphite text-base sm:text-sm flex-1">
                {t(`items.${h.key}.body`)}
              </p>
              <span
                className="font-display uppercase text-xs tracking-wide text-ink border-b-2 border-gold pb-0.5 w-fit"
                style={{ fontWeight: 800 }}
              >
                {t("readMore")} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
