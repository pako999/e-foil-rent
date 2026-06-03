import { getTranslations } from "next-intl/server";
import { FEATURE_KEYS } from "@/lib/content";

const ICONS = {
  electric: "⚡",
  silent: "🌿",
  easy: "🏄",
} as const;

export async function FeatureBadges() {
  const t = await getTranslations("features");
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="container-x grid md:grid-cols-3 gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
        {FEATURE_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-start gap-4 py-10 md:px-8 first:md:pl-0 last:md:pr-0"
          >
            <div className="shrink-0 w-14 h-14 bg-gold border-2 border-ink text-3xl flex items-center justify-center">
              {ICONS[key]}
            </div>
            <div>
              <h3 className="font-display uppercase tracking-tight text-xl text-ink" style={{ fontWeight: 900 }}>
                {t(`${key}.title`)}
              </h3>
              <p className="text-graphite mt-1 text-sm">{t(`${key}.body`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
