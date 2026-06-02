import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = [1, 2, 3] as const;
  return (
    <section id="how" className="bg-foam scroll-mt-20">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="h-display text-4xl md:text-5xl text-ocean mb-4">
            {t("title")}
          </h2>
          <p className="text-ocean/70 text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((n) => (
            <div
              key={n}
              className="relative card p-8 hover:-translate-y-1"
            >
              <div className="absolute -top-4 -left-2 font-display text-7xl text-sun/20 leading-none select-none">
                0{n}
              </div>
              <div className="relative">
                <div className="font-mono text-sun-dark text-xs uppercase tracking-widest mb-3">
                  Step 0{n}
                </div>
                <h3 className="font-display uppercase tracking-tight text-2xl text-ocean mb-2">
                  {t(`step${n}Title`)}
                </h3>
                <p className="text-ocean/70 text-sm">{t(`step${n}Body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
