import Image from "next/image";
import { getTranslations } from "next-intl/server";

const ADVANTAGE_KEYS = ["weight", "battery", "modular", "runtime"] as const;

/**
 * Product-shot section: shows the full Duotone Foil Assist Cruise Set
 * on a gold background (CSS multiply blend strips the studio white)
 * and lists the four headline advantages over competing e-foils.
 */
export async function FoilShowcase() {
  const t = await getTranslations("foilShowcase");

  return (
    <section className="bg-gold border-y-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-display uppercase tracking-widest text-xs text-ink mb-3" style={{ fontWeight: 800 }}>
            🪶 // {t("eyebrow")}
          </p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-ink/80 text-xl sm:text-lg">{t("subtitle")}</p>
        </div>

        <div className="relative w-full aspect-[16/9]">
          <Image
            src="/Foil-Cruise-Set-Complete-AL-_incl.-Board.webp"
            alt={t("alt")}
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-contain"
            // Multiply blends the studio-white background of the product
            // shot directly into the section's gold fill, so the foil
            // appears to float on yellow without any image-edit step.
            style={{ mixBlendMode: "multiply" }}
            priority={false}
          />
        </div>

        <div className="mt-12 sm:mt-16">
          <p className="font-display uppercase tracking-widest text-xs text-ink mb-3" style={{ fontWeight: 800 }}>
            ⚡ // {t("advEyebrow")}
          </p>
          <h3 className="h-display text-3xl sm:text-4xl text-ink mb-2">
            {t("advTitle")}
          </h3>
          <p className="text-ink/80 mb-10 max-w-2xl">{t("advSubtitle")}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            {ADVANTAGE_KEYS.map((k, i) => (
              <article
                key={k}
                className="bg-paper border-2 border-ink p-6 flex items-start gap-4"
                style={{ boxShadow: "6px 6px 0 0 #1a1a1a" }}
              >
                <span
                  className="shrink-0 w-12 h-12 bg-ink text-gold flex items-center justify-center font-display text-xl"
                  style={{ fontWeight: 900 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4
                    className="font-display uppercase tracking-tight text-lg sm:text-xl text-ink mb-1"
                    style={{ fontWeight: 900 }}
                  >
                    {t(`adv.${k}.title`)}
                  </h4>
                  <p className="text-graphite text-sm leading-relaxed">
                    {t(`adv.${k}.body`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
