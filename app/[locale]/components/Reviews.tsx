import { getTranslations } from "next-intl/server";
import { REVIEW_KEYS } from "@/lib/content";

const STARS = "★★★★★";

export async function Reviews() {
  const t = await getTranslations("reviews");
  return (
    <section className="bg-gradient-to-br from-ocean to-ocean-deep text-white">
      <div className="container-x py-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-light mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="h-display text-4xl md:text-5xl">{t("title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEW_KEYS.map((k) => (
            <figure
              key={k}
              className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-sun/40 transition"
            >
              <div className="text-sun text-xl mb-3 tracking-widest">
                {STARS}
              </div>
              <blockquote className="text-white/90 leading-relaxed mb-4">
                “{t(`items.${k}.quote`)}”
              </blockquote>
              <figcaption className="font-mono text-sm text-white/60">
                — {t(`items.${k}.author`)}, {t(`items.${k}.city`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
