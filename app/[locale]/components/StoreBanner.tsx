import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/content";

const CATEGORIES = ["E-Foil", "Wingfoil", "Kiteboarding", "Windsurfing"] as const;
const BRANDS = [
  "Duotone",
  "Neilpryde",
  "Cabrinha",
  "ION",
  "Gaastra",
  "JP Australia",
  "Point 7",
  "Tabou",
] as const;

export async function StoreBanner() {
  const t = await getTranslations("storeBanner");
  return (
    <section className="bg-gold border-b-2 border-ink">
      <div className="container-x py-16 md:py-20">
        <div className="grid md:grid-cols-[1.4fr,1fr] gap-10 items-start">
          <div>
            <p className="eyebrow mb-3">🛒 // {t("eyebrow")}</p>
            <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
              {t("title")}
            </h2>
            <p className="text-ink text-lg max-w-xl mb-6">{t("body")}</p>
            <a
              href={SITE.mainSite}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              {t("cta")} →
            </a>
          </div>
          <div>
            <p className="font-display uppercase tracking-widest text-xs text-ink mb-3" style={{ fontWeight: 800 }}>
              {t("categoriesLabel")}
            </p>
            <ul className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((c) => (
                <li
                  key={c}
                  className="font-display uppercase text-sm bg-ink text-gold border-2 border-ink px-3 py-1.5 tracking-wide"
                  style={{ fontWeight: 800 }}
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="font-display uppercase tracking-widest text-xs text-ink mb-3" style={{ fontWeight: 800 }}>
              {t("brandsLabel")}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {BRANDS.map((b) => (
                <li
                  key={b}
                  className="font-display uppercase text-base text-ink flex items-center gap-2"
                  style={{ fontWeight: 800 }}
                >
                  <span className="text-ink/40">★</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
