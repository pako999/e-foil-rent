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

  return (
    <section id="boards" className="bg-sand/40 scroll-mt-20">
      <div className="container-x py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
            {t("title")}
          </p>
          <h2 className="h-display text-4xl md:text-5xl text-ocean">
            {t("subtitle")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <article
              key={board.id}
              className="group card flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-[4/3] bg-ocean/5 relative overflow-hidden">
                <Image
                  src={board.imageUrl}
                  alt={board.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-ocean font-mono text-xs px-3 py-1 rounded-full">
                  {t("from30", {
                    price: formatPrice(board.halfHourPrice, intlLocale),
                  })}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display uppercase tracking-tight text-2xl text-ocean">
                  {board.name}
                </h3>
                <p className="text-ocean/70 mt-2 mb-6 flex-1 text-sm">
                  {board.description}
                </p>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-mono text-2xl text-ocean">
                    {formatPrice(board.dailyPrice, intlLocale)}
                    <span className="text-sm text-ocean/60">{t("perDay")}</span>
                  </span>
                  <span className="font-mono text-xs text-ocean/60">
                    {t("fromWeek", {
                      price: formatPrice(board.weeklyPrice, intlLocale),
                    })}
                  </span>
                </div>
                <a
                  href={`#book?board=${board.id}`}
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
