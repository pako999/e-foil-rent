import { getTranslations } from "next-intl/server";
import type { Board } from "@/db/schema";
import { PACKAGES, packageTotal, formatPrice, type PackageId } from "@/lib/pricing";
import { PACKAGE_HIGHLIGHTS } from "@/lib/content";
import { intlLocale as toIntlLocale, type Locale } from "@/i18n/request";

function cheapestFor(pkgId: PackageId, boards: Board[]): number {
  const pkg = PACKAGES.find((p) => p.id === pkgId)!;
  return Math.min(...boards.map((b) => packageTotal(pkg, b)));
}

export async function Packages({
  boards,
  locale,
}: {
  boards: Board[];
  locale: Locale;
}) {
  const t = await getTranslations("packages");
  const intlLocale = toIntlLocale(locale);

  return (
    <section id="packages" className="bg-cream scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-4">
            {t("title")}
          </h2>
          <p className="text-graphite text-xl sm:text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const highlight = PACKAGE_HIGHLIGHTS[pkg.id];
            const price = boards.length > 0 ? cheapestFor(pkg.id, boards) : 0;
            const isBest = highlight.best;
            return (
              <article
                key={pkg.id}
                className={`relative card card-hover p-6 sm:p-6 flex flex-col ${
                  isBest ? "bg-gold" : "bg-paper"
                }`}
              >
                {isBest && (
                  <span className="absolute -top-3 left-6 bg-ink text-gold text-sm sm:text-xs font-display uppercase tracking-widest px-3 py-1" style={{ fontWeight: 800 }}>
                    ★ {t("bestBadge")}
                  </span>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl sm:text-4xl">{highlight.icon}</div>
                  <span className="font-mono text-sm sm:text-xs uppercase tracking-widest text-ink/60 border-2 border-ink px-2 py-1 sm:py-0.5">
                    {t(`items.${pkg.id}.duration`)}
                  </span>
                </div>
                <h3 className="font-display uppercase tracking-tight text-3xl sm:text-2xl text-ink" style={{ fontWeight: 900 }}>
                  {t(`items.${pkg.id}.name`)}
                </h3>
                <p className="text-graphite text-base sm:text-sm mt-2 mb-5 leading-relaxed">
                  {t(`items.${pkg.id}.desc`)}
                </p>
                <div className="mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-sm sm:text-xs text-ink/60 uppercase">
                      from
                    </span>
                    <span className="font-display text-5xl sm:text-4xl text-ink" style={{ fontWeight: 900 }}>
                      {formatPrice(price, intlLocale)}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-ink/50 mt-1">
                    {t("vatNote")}
                  </p>
                  {pkg.days >= 3 && boards[0] && (() => {
                    const board = boards[0]!;
                    const perDay = Math.round(price / pkg.days);
                    const fullDay = board.dailyPrice * pkg.days;
                    const savings = fullDay - price;
                    const savingsPct = Math.round((savings / fullDay) * 100);
                    return (
                      <div className="mt-3 sm:mt-2 space-y-1 sm:space-y-0.5">
                        <p className="font-mono text-sm sm:text-xs text-ink/70">
                          {t("perDay", { price: formatPrice(perDay, intlLocale) })}
                        </p>
                        {savings > 0 && (
                          <p
                            className={`font-display uppercase text-sm sm:text-xs tracking-wide border-2 border-ink px-2 py-1 sm:py-0.5 inline-block ${
                              isBest ? "bg-ink text-gold" : "bg-gold text-ink"
                            }`}
                            style={{ fontWeight: 800 }}
                          >
                            ↓ {t("savings", {
                              amount: formatPrice(savings, intlLocale),
                              pct: savingsPct,
                            })}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <ul className="space-y-3 sm:space-y-2 mb-6 flex-1">
                  {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 sm:gap-2 text-base sm:text-sm text-ink leading-snug"
                    >
                      <span className="w-6 h-6 sm:w-5 sm:h-5 mt-0.5 shrink-0 bg-ink text-gold flex items-center justify-center font-bold text-sm sm:text-xs">
                        ✓
                      </span>
                      {t(`items.${pkg.id}.${f}`)}
                    </li>
                  ))}
                </ul>
                {pkg.id === "day1" && (
                  <p className="text-sm sm:text-xs text-ink/80 mb-4 border-l-2 border-ink pl-3 italic leading-relaxed">
                    💡 {t("items.day1.purchaseCredit")}
                  </p>
                )}
                <a
                  href="#book"
                  data-pkg-id={pkg.id}
                  className={`${isBest ? "btn-ghost" : "btn-primary"} text-base sm:text-sm`}
                >
                  {t("select")} →
                </a>
              </article>
            );
          })}
        </div>

        {/* Locations notice — applies to every package on the grid above. */}
        <div className="mt-10 border-2 border-ink bg-paper p-5 flex items-start gap-4">
          <span className="text-3xl sm:text-2xl shrink-0">📍</span>
          <p className="text-base sm:text-sm text-ink leading-relaxed">
            {t("locationsNotice")}
          </p>
        </div>
      </div>
    </section>
  );
}
