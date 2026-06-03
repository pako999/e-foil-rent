import { getTranslations } from "next-intl/server";
import { LOCATION } from "@/lib/content";

export async function LocationBlock() {
  const t = await getTranslations("location");
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${LOCATION.mapsQuery}`;
  const embedSrc = `https://www.google.com/maps?q=${LOCATION.mapsQuery}&output=embed`;

  return (
    <section id="location" className="bg-paper scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="eyebrow mb-4">📍 // {t("title")}</p>
          <h2 className="h-display text-5xl md:text-6xl text-ink mb-6">
            {t("name")}
          </h2>
          <p className="text-graphite text-lg max-w-md mb-6">{t("blurb")}</p>
          <p className="text-mute mb-6 font-mono text-sm">
            {t("address")}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            {t("directions")} →
          </a>
        </div>
        <div className="aspect-video w-full border-2 border-ink overflow-hidden">
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
