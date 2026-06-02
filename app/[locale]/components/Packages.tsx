import { getTranslations } from "next-intl/server";
import type { Board } from "@/db/schema";
import { PACKAGES, packageTotal, formatPrice, type PackageId } from "@/lib/pricing";
import { PACKAGE_HIGHLIGHTS } from "@/lib/content";
import type { Locale } from "@/i18n/request";

/**
 * Cheapest "from" price across active boards for a given package.
 * Lets us show the marketing card without locking the user into a board.
 */
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
    <section id="packages" className="bg-foam scroll-mt-20">
      <div className="container-x py-20">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="h-display text-4xl md:text-5xl text-ocean mb-4">
            {t("title")}
          </h2>
          <p className="text-ocean/70 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const highlight = PACKAGE_HIGHLIGHTS[pkg.id];
            const price = boards.length > 0 ? cheapestFor(pkg.id, boards) : 0;
            const isBest = highlight.best;
            return (
              <article
                key={pkg.id}
                className={`relative card p-6 flex flex-col ${
                  isBest ? "ring-2 ring-sun shadow-cardHover" : ""
                }`}
              >
                {isBest && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sun text-white text-xs font-display uppercase tracking-widest px-4 py-1 rounded-full shadow-sun">
                    {t("bestBadge")}
                  </span>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{highlight.icon}</div>
                  <span className="font-mono text-xs uppercase tracking-widest text-ocean/50">
                    {t(`items.${pkg.id}.duration`)}
                  </span>
                </div>
                <h3 className="font-display uppercase tracking-tight text-2xl text-ocean">
                  {t(`items.${pkg.id}.name`)}
                </h3>
                <p className="text-ocean/70 text-sm mt-2 mb-5">
                  {t(`items.${pkg.id}.desc`)}
                </p>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-mono text-xs text-ocean/60">
                    {t("fromPrice", { price: "" }).replace("{price}", "").trim()}
                  </span>
                  <span className="font-display text-4xl text-ocean">
                    {formatPrice(price, intlLocale)}
                  </span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {(["f1", "f2", "f3", "f4"] as const).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ocean/80"
                    >
                      <svg
                        className="w-5 h-5 mt-0.5 shrink-0 text-sky"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t(`items.${pkg.id}.${f}`)}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#book?pkg=${pkg.id}`}
                  data-pkg-id={pkg.id}
                  className={isBest ? "btn-primary" : "btn-ghost"}
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
