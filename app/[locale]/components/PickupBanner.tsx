import { getTranslations } from "next-intl/server";

export async function PickupBanner() {
  const t = await getTranslations("pickup");
  return (
    <section className="bg-gold border-b-2 border-ink">
      <div className="container-x py-4 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 sm:gap-6 text-ink text-center sm:text-left">
          <p className="font-display uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2" style={{ fontWeight: 800 }}>
            <span className="text-lg">🚚</span> {t("label")}
          </p>
          <p className="font-display uppercase tracking-wide text-sm sm:text-base" style={{ fontWeight: 700 }}>
            {t("cities")}
          </p>
          <span className="hidden sm:inline-block w-px h-4 bg-ink/30" />
          <p className="text-sm text-ink/80">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
