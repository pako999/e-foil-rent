import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/content";

export async function GiftVoucher() {
  const t = await getTranslations("gift");
  return (
    <section className="bg-foam">
      <div className="container-x py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sun via-sun-dark to-sun-dark text-white p-8 md:p-14 shadow-cardHover">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-ocean/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr,auto] items-center gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/80 mb-2">
                🎁 {t("eyebrow")}
              </p>
              <h2 className="h-display text-3xl md:text-4xl mb-3">
                {t("title")}
              </h2>
              <p className="text-white/90 text-lg max-w-xl">{t("body")}</p>
            </div>
            <a
              href={`mailto:${SITE.contactEmail}?subject=Gift%20voucher`}
              className="btn bg-white text-sun-dark hover:bg-foam shadow-cardHover whitespace-nowrap"
            >
              {t("cta")} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
