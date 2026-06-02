import { getTranslations } from "next-intl/server";
import { FEATURE_KEYS } from "@/lib/content";

const ICONS = {
  electric: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  silent: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M3 12c2-4 5-4 7 0s5 4 7 0 5-4 4 0" />
    </svg>
  ),
  easy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  ),
} as const;

export async function FeatureBadges() {
  const t = await getTranslations("features");
  return (
    <section className="bg-white border-b border-ink/10">
      <div className="container-x grid md:grid-cols-3 gap-8 py-16">
        {FEATURE_KEYS.map((key) => (
          <div key={key} className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-teal/10 text-teal-dark flex items-center justify-center">
              {ICONS[key]}
            </div>
            <div>
              <h3 className="font-display uppercase tracking-tight text-xl text-ink">
                {t(`${key}.title`)}
              </h3>
              <p className="text-ink/70 mt-1">{t(`${key}.body`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
