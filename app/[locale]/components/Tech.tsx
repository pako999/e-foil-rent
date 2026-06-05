import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TECH_FEATURES } from "@/lib/content";

const ICONS: Record<(typeof TECH_FEATURES)[number], string> = {
  range: "🔋",
  speed: "💨",
  battery: "⚡",
  weight: "🪶",
  silent: "🤫",
  easy: "🎯",
};

export async function Tech() {
  const t = await getTranslations("tech");
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="container-x py-20 grid lg:grid-cols-[1fr,1.2fr] gap-12 items-center">
        <div className="relative aspect-square w-full max-w-md mx-auto border-2 border-ink overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #FFD600" }}>
          <Image
            src="/action-2.jpg"
            alt="E-foil rider"
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-xl sm:text-lg mb-8">{t("subtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECH_FEATURES.map((key) => (
              <div key={key} className="flex items-start gap-3 p-4 border-2 border-ink bg-cream">
                <div className="text-2xl shrink-0">{ICONS[key]}</div>
                <div>
                  <h3 className="font-display uppercase tracking-wide text-ink" style={{ fontWeight: 800 }}>
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-graphite mt-1">
                    {t(`items.${key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
