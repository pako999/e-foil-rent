import { getTranslations } from "next-intl/server";
import type { Board } from "@/db/schema";
import { PACKAGES, packageTotal, formatPrice, type PackageId } from "@/lib/pricing";
import { PACKAGE_HIGHLIGHTS } from "@/lib/content";
import type { Locale } from "@/i18n/request";

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
  const intlLocale = locale === "sl" ? "sl-SI" : "en-IE";

  return (
    <section id="packages" className="bg-cream scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-5xl md:text-6xl text-ink mb-4">
            {t("title")}
          </h2>
          <p className="text-graphite text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const highlight = PACKAGE_HIGHLIGHTS[pkg.id];
            const price = boards.length > 0 ? cheapestFor(pkg.id, boards) : 0;
            const isBest = highlight.best;
            return (
              <article
                key={pkg.id}
                className={`relative card card-hover p-6 flex flex-col ${
                  isBest ? "bg-gold" : "bg-paper"
                }`}
              >
                {isBest && (
                  <span className="absolute -top-3 left-6 bg-ink text-gold text-xs font-display uppercase tracking-widest px-3 py-1" style={{ fontWeight: 800 }}>
                    ★ {t("bestBadge")}
                  </span>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{highlight.icon}</div>
                  <span className="font-mono text-xs uppercase tracking-widest text-ink/60 border-2 border-ink px-2 py-0.5">
                    {t(`items.${pkg.id}.duration`)}
                  </span>
                </div>
                <h3 className="font-display uppercase tracking-tight text-2xl text-ink" style={{ fontWeight: 900 }}>
                  {t(`items.${pkg.id}.name`)}
                </h3>
                <p className="text-graphite text-sm mt-2 mb-5">
                  {t(`items.${pkg.id}.desc`)}
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-mono text-xs text-ink/60 uppercase">
                    from
                  </span>
                  <span className="font-display text-4xl text-ink" style={{ fontWeight: 900 }}>
                    {formatPrice(price, intlLocale)}
                  </span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <span className="w-5 h-5 mt-0.5 shrink-0 bg-ink text-gold flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      {t(`items.${pkg.id}.${f}`)}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#book?pkg=${pkg.id}`}
                  data-pkg-id={pkg.id}
                  className={isBest ? "btn-ghost" : "btn-primary"}
                >
                  {t("select")} →
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
