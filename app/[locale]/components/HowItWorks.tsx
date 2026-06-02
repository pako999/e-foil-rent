import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = [1, 2, 3] as const;
  return (
    <section id="how" className="bg-ink/[0.02]">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="h-display text-4xl md:text-5xl text-ink mb-4">
            {t("title")}
          </h2>
          <p className="text-ink/70 text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((n) => (
            <div
              key={n}
              className="border border-ink/10 bg-white p-8 hover:border-teal-dark transition-colors"
            >
              <div className="font-mono text-teal-dark text-sm mb-4">
                0{n}
              </div>
              <h3 className="font-display uppercase tracking-tight text-2xl text-ink mb-2">
                {t(`step${n}Title`)}
              </h3>
              <p className="text-ink/70">{t(`step${n}Body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
