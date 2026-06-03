import { getTranslations } from "next-intl/server";
import { REVIEW_KEYS } from "@/lib/content";

const STARS = "★★★★★";

export async function Reviews() {
  const t = await getTranslations("reviews");
  return (
    <section className="bg-ink text-paper border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-display uppercase tracking-widest text-xs text-gold mb-3" style={{ fontWeight: 800 }}>
            // {t("eyebrow")}
          </p>
          <h2 className="h-display text-5xl md:text-6xl">{t("title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEW_KEYS.map((k) => (
            <figure
              key={k}
              className="bg-paper text-ink p-6 border-2 border-gold"
            >
              <div className="text-gold text-xl mb-3 tracking-widest" style={{ WebkitTextStroke: "1px #1a1a1a" }}>
                {STARS}
              </div>
              <blockquote className="leading-relaxed mb-4">
                “{t(`items.${k}.quote`)}”
              </blockquote>
              <figcaption className="font-mono text-sm text-mute pt-3 border-t-2 border-ink/10">
                — <strong className="text-ink">{t(`items.${k}.author`)}</strong>, {t(`items.${k}.city`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
