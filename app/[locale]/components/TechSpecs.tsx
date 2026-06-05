import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SITE } from "@/lib/content";

type Spec = { labelKey: string; value: string };
type Group = { titleKey: string; specs: Spec[] };

const GROUPS: Group[] = [
  {
    titleKey: "performance",
    specs: [
      { labelKey: "runtime", value: "30–60 min" },
      { labelKey: "speedLevels", value: "7" },
      { labelKey: "chargeTime", value: "≈ 1 h" },
    ],
  },
  {
    titleKey: "battery",
    specs: [
      { labelKey: "cells", value: "2× LiPo" },
      { labelKey: "capacity", value: "7 Ah" },
      { labelKey: "voltage", value: "22.8 V × 2" },
      { labelKey: "energy", value: "159.6 Wh × 2" },
      { labelKey: "batteryWeight", value: "1 kg × 2 = 2 kg" },
      { labelKey: "harnessTotal", value: "3.76 kg" },
    ],
  },
  {
    titleKey: "mast",
    specs: [
      { labelKey: "mastCruiseAl", value: "3.55 kg" },
      { labelKey: "lenCruise", value: "80 cm" },
    ],
  },
  {
    titleKey: "wings",
    specs: [
      { labelKey: "frontWing", value: "1600 cm²" },
      { labelKey: "backWing", value: "225 cm²" },
    ],
  },
  {
    titleKey: "harness",
    specs: [
      { labelKey: "sizeSm", value: "S/M · 71–89 cm" },
      { labelKey: "sizeLxxl", value: "L/XXL · 89–114 cm" },
    ],
  },
];

export async function TechSpecs() {
  const t = await getTranslations("specs");
  return (
    <section id="specs" className="bg-ink text-paper border-b-2 border-ink scroll-mt-20">
      <div className="container-x py-20">
        <div className="grid lg:grid-cols-[1fr,1.4fr] gap-12 items-start">
          {/* Image + product name */}
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-square w-full border-2 border-gold overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #FFD600" }}>
              <Image
                src="/action-1.jpg"
                alt="Duotone E-Foil Assist Aluminum"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>
            <p className="font-display uppercase tracking-widest text-xs text-gold mt-6 mb-2" style={{ fontWeight: 800 }}>
              // {t("eyebrow")}
            </p>
            <h2 className="h-display text-4xl md:text-5xl text-paper mb-4">
              {t("title")}
            </h2>
            <p className="text-paper/75 mb-6">{t("model")}</p>
            <a
              href={SITE.shop}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              {t("buyCta")} →
            </a>
          </div>

          {/* Spec table */}
          <div>
            <div className="space-y-8">
              {GROUPS.map((g) => (
                <div key={g.titleKey}>
                  <h3 className="font-display uppercase tracking-widest text-xs text-gold mb-3 pb-2 border-b-2 border-gold/30" style={{ fontWeight: 800 }}>
                    {t(`groups.${g.titleKey}`)}
                  </h3>
                  <dl className="divide-y-2 divide-paper/10">
                    {g.specs.map((s) => (
                      <div
                        key={s.labelKey}
                        className="grid grid-cols-[1fr,auto] gap-4 py-2.5"
                      >
                        <dt className="text-paper/75 text-sm">
                          {t(`labels.${s.labelKey}`)}
                        </dt>
                        <dd className="font-mono text-paper text-sm font-bold">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-paper/50 mt-8 pt-6 border-t-2 border-paper/10">
              {t("footnote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
