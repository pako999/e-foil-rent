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
    <section className="bg-foam">
      <div className="container-x grid md:grid-cols-3 gap-6 py-16">
        {FEATURE_KEYS.map((key) => (
          <div
            key={key}
            className="bg-white rounded-2xl shadow-card p-6 flex items-start gap-4 hover:shadow-cardHover hover:-translate-y-1 transition"
          >
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky/15 text-3xl flex items-center justify-center">
              {ICONS[key]}
            </div>
            <div>
              <h3 className="font-display uppercase tracking-tight text-xl text-ocean">
                {t(`${key}.title`)}
              </h3>
              <p className="text-ocean/70 mt-1 text-sm">{t(`${key}.body`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
