import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/content";

export async function GiftVoucher() {
  const t = await getTranslations("gift");
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="container-x py-16">
        <div className="relative overflow-hidden border-2 border-ink bg-gold p-8 md:p-14" style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}>
          <div className="grid md:grid-cols-[1fr,auto] items-center gap-8">
            <div>
              <p className="eyebrow mb-2">🎁 // {t("eyebrow")}</p>
              <h2 className="h-display text-4xl md:text-5xl text-ink mb-3">
                {t("title")}
              </h2>
              <p className="text-ink text-lg max-w-xl">{t("body")}</p>
            </div>
            <a
              href={`mailto:${SITE.contactEmail}?subject=Gift%20voucher`}
              className="btn-ghost whitespace-nowrap"
            >
              {t("cta")} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
