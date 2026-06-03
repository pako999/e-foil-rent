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
          <h2 className="h-display text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-lg">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden border-2 border-ink ${
                i === 0 || i === 4 ? "md:row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
