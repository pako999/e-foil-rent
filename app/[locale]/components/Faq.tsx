import { getTranslations } from "next-intl/server";
import { FAQ_KEYS } from "@/lib/content";

export async function Faq() {
  const t = await getTranslations("faq");
  return (
    <section id="faq" className="bg-foam scroll-mt-20">
      <div className="container-x py-20 max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="h-display text-4xl md:text-5xl text-ocean">
            {t("title")}
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_KEYS.map((k) => (
            <details
              key={k}
              className="group bg-white rounded-xl shadow-card border border-ocean/5 overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 font-display uppercase tracking-wide text-ocean">
                <span>{t(`items.${k}.q`)}</span>
                <span className="shrink-0 w-8 h-8 rounded-full bg-sky/15 text-sky flex items-center justify-center transition group-open:rotate-45 group-open:bg-sun/15 group-open:text-sun-dark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="w-4 h-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-5 text-ocean/75 leading-relaxed">
                {t(`items.${k}.a`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
