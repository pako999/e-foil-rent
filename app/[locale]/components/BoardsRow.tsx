import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Board } from "@/db/schema";
import { formatPrice } from "@/lib/pricing";
import type { Locale } from "@/i18n/request";

export async function BoardsRow({
  boards,
  locale,
}: {
  boards: Board[];
  locale: Locale;
}) {
  const t = await getTranslations("boards");
  const intlLocale = locale === "sl" ? "sl-SI" : "en-IE";

  if (boards.length === 0) return null;

  // Single-board layout — featured product card with side-by-side image + details.
  if (boards.length === 1) {
    const board = boards[0]!;
    return (
      <section id="boards" className="bg-paper scroll-mt-20 border-b-2 border-ink">
        <div className="container-x py-20">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-3">// {t("title")}</p>
            <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
              {t("subtitle")}
            </h2>
            <p className="text-graphite text-xl sm:text-lg mt-3">{t("tagline")}</p>
          </div>
          <article className="grid md:grid-cols-2 border-2 border-ink overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}>
            <div className="aspect-[4/3] md:aspect-auto relative bg-cream border-b-2 md:border-b-0 md:border-r-2 border-ink overflow-hidden">
              <Image
                src={board.imageUrl}
                alt={board.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute top-3 right-3 bg-gold border-2 border-ink text-ink font-mono text-xs px-3 py-1">
                {t("from30", { price: formatPrice(board.halfHourPrice, intlLocale) })}
              </span>
            </div>
            <div className="p-8 flex flex-col">
              <h3 className="font-display uppercase tracking-tight text-3xl text-ink mb-3" style={{ fontWeight: 900 }}>
                {board.name}
              </h3>
              <p className="text-graphite mb-6 flex-1">{board.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="border-2 border-ink p-3 bg-cream">
                  <p className="font-mono text-xs uppercase text-ink/60">{t("perDay").replace("/", "")}</p>
                  <p className="font-display text-2xl text-ink" style={{ fontWeight: 900 }}>
                    {formatPrice(board.dailyPrice, intlLocale)}
                  </p>
                </div>
                <div className="border-2 border-ink p-3 bg-gold">
                  <p className="font-mono text-xs uppercase text-ink/70">/teden · /week</p>
                  <p className="font-display text-2xl text-ink" style={{ fontWeight: 900 }}>
                    {formatPrice(board.weeklyPrice, intlLocale)}
                  </p>
                </div>
              </div>
              <a href="#book" data-board-id={board.id} className="btn-primary w-full">
                {t("bookCta")} →
              </a>
            </div>
          </article>
        </div>
      </section>
    );
  }

  // Multi-board fallback — preserves the original 3-up grid.
  return (
    <section id="boards" className="bg-paper scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">// {t("title")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
            {t("subtitle")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <article
              key={board.id}
              className="group card card-hover flex flex-col"
            >
              <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden border-b-2 border-ink">
                <Image
                  src={board.imageUrl}
                  alt={board.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-gold border-2 border-ink text-ink font-mono text-xs px-3 py-1">
                  {t("from30", {
                    price: formatPrice(board.halfHourPrice, intlLocale),
                  })}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display uppercase tracking-tight text-2xl text-ink" style={{ fontWeight: 900 }}>
                  {board.name}
                </h3>
                <p className="text-graphite mt-2 mb-6 flex-1 text-sm">
                  {board.description}
                </p>
                <div className="flex items-baseline justify-between mb-4 pb-4 border-b-2 border-ink/10">
                  <span className="font-display text-3xl text-ink" style={{ fontWeight: 900 }}>
                    {formatPrice(board.dailyPrice, intlLocale)}
                    <span className="text-sm text-mute font-sans">{t("perDay")}</span>
                  </span>
                  <span className="font-mono text-xs text-mute">
                    {t("fromWeek", {
                      price: formatPrice(board.weeklyPrice, intlLocale),
                    })}
                  </span>
                </div>
                <a
                  href="#book"
                  data-board-id={board.id}
                  className="btn-sky w-full"
                >
                  {t("bookCta")} →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
