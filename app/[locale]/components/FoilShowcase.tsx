import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Product-shot section: shows the full Duotone Foil Assist Cruise Set
 * (board + foil + harness) inline below the hero video. The source
 * image has a near-white studio background; we drop it visually with
 * CSS `mix-blend-mode: multiply` against the cream section background
 * — no server-side image processing required.
 */
export async function FoilShowcase() {
  const t = await getTranslations("foilShowcase");

  return (
    <section className="bg-cream border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">🪶 // {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-xl sm:text-lg">{t("subtitle")}</p>
        </div>

        <div
          className="relative w-full aspect-[16/9] border-2 border-ink bg-paper overflow-hidden"
          style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
        >
          <Image
            src="/Foil-Cruise-Set-Complete-AL-_incl.-Board.webp"
            alt={t("alt")}
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-contain p-6 sm:p-10"
            // The studio shot ships with a near-white background; multiply
            // blends those white pixels into the cream section so the
            // product appears to float without an image-edit step.
            style={{ mixBlendMode: "multiply" }}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
