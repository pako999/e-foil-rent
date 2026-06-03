import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/content";

export async function ShopCta() {
  const t = await getTranslations("shop");
  return (
    <section className="bg-paper border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="grid md:grid-cols-2 items-stretch border-2 border-ink overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}>
          <div className="relative min-h-[280px] md:min-h-[360px] bg-ink">
            <Image
              src="/board-1.jpg"
              alt="Duotone e-foil"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="bg-gold p-8 md:p-12 flex flex-col justify-center">
            <p className="eyebrow mb-3">🛒 // {t("eyebrow")}</p>
            <h2 className="h-display text-4xl md:text-5xl text-ink mb-4">
              {t("title")}
            </h2>
            <p className="text-ink text-lg mb-6 max-w-md">{t("body")}</p>
            <a
              href={SITE.shop}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost w-fit"
            >
              {t("cta")} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
