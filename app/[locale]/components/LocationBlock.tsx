import { getTranslations } from "next-intl/server";
import { LOCATION } from "@/lib/content";

export async function LocationBlock() {
  const t = await getTranslations("location");
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${LOCATION.mapsQuery}`;
  const embedSrc = `https://www.google.com/maps?q=${LOCATION.mapsQuery}&output=embed`;

  return (
    <section id="location" className="bg-sand/40 scroll-mt-20">
      <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-sun-dark mb-4">
            📍 {t("title")}
          </p>
          <h2 className="h-display text-4xl md:text-5xl text-ocean mb-6">
            {t("name")}
          </h2>
          <p className="text-ocean/75 text-lg max-w-md mb-6">{t("blurb")}</p>
          <p className="text-ocean/60 mb-6 font-mono text-sm">
            {t("address")}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="btn-sky"
          >
            {t("directions")} →
          </a>
        </div>
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-card border border-ocean/10">
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
