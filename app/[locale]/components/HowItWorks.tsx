import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = [1, 2, 3] as const;
  return (
    <section id="how" className="bg-paper scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="h-display text-5xl md:text-6xl text-ink mb-4">
            {t("title")}
          </h2>
          <p className="text-graphite text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((n) => (
            <div
              key={n}
              className="relative card card-hover p-8"
            >
              <div className="absolute -top-6 -left-2 font-display text-8xl text-gold leading-none select-none" style={{ fontWeight: 900, WebkitTextStroke: "2px #1a1a1a" }}>
                0{n}
              </div>
              <div className="relative pt-10">
                <h3 className="font-display uppercase tracking-tight text-2xl text-ink mb-2" style={{ fontWeight: 900 }}>
                  {t(`step${n}Title`)}
                </h3>
                <p className="text-graphite text-sm">{t(`step${n}Body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
