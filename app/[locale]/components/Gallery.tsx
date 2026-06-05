import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GALLERY_IMAGES } from "@/lib/content";

export async function Gallery() {
  const t = await getTranslations("gallery");
  return (
    <section id="gallery" className="bg-cream scroll-mt-20 border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">// {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <figure
              key={i}
              className="group relative aspect-[4/3] overflow-hidden border-2 border-ink bg-cream"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
