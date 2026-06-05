import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LOCATION } from "@/lib/content";

export async function LocationBlock() {
  const t = await getTranslations("location");
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${LOCATION.mapsQuery}`;
  const embedSrc = `https://www.google.com/maps?q=${LOCATION.mapsQuery}&output=embed`;

  return (
    <section id="location" className="bg-paper scroll-mt-20 border-b-2 border-ink">
      {/* Hero band — full-bleed lake photo with overlaid text + CTA */}
      <div className="relative w-full overflow-hidden border-b-2 border-ink">
        <div className="relative aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7] min-h-[360px] sm:min-h-[420px]">
          <Image
            src="/green-lake.webp"
            alt="Green Lake, Kidričevo"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
          />
          {/* Asymmetric gradient — clear water on the right, dark on the left
              for headline legibility. */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container-x text-paper">
            <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-5 border-2 border-gold px-3 py-1.5 bg-ink/40 backdrop-blur-sm">
              📍 // {t("title")}
            </p>
            <h2 className="h-display text-5xl sm:text-6xl md:text-7xl text-paper max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              {t("name")}
            </h2>
            <p className="mt-5 text-paper/90 text-lg max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {t("blurb")}
            </p>
            <p className="mt-4 font-mono text-sm text-paper/75">
              {t("address")}
            </p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-7 inline-flex"
            >
              {t("directions")} →
            </a>
          </div>
        </div>
      </div>

      {/* Interactive map */}
      <div className="container-x py-12">
        <div className="aspect-video w-full border-2 border-ink overflow-hidden" style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}>
          <iframe
            src={embedSrc}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Green Lake Kidričevo"
          />
        </div>
      </div>
    </section>
  );
}
