import { getTranslations } from "next-intl/server";
import { FAQ_KEYS } from "@/lib/content";

export async function Faq() {
  const t = await getTranslations("faq");
  return (
    <section id="faq" className="bg-cream scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20 max-w-3xl">
        <div className="mb-10">
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink">
            {t("title")}
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_KEYS.map((k) => (
            <details
              key={k}
              className="group bg-paper border-2 border-ink overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 font-display uppercase tracking-wide text-ink group-open:bg-gold transition-colors" style={{ fontWeight: 800 }}>
                <span>{t(`items.${k}.q`)}</span>
                <span className="shrink-0 w-7 h-7 bg-ink text-gold flex items-center justify-center transition group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="w-4 h-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 py-5 text-graphite leading-relaxed border-t-2 border-ink">
                {t(`items.${k}.a`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
