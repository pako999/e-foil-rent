import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative bg-ink text-paper overflow-hidden border-b-2 border-ink min-h-[88vh] min-h-[88svh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft left-side darken so the headline stays readable without
            washing out the photo. Right side stays clear. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/60 to-transparent" />
      </div>
      <div className="relative container-x py-20 md:py-24 w-full">
        {/* Co-brand row — surf-store × Duotone. Source logos are dark grey,
            forced to white on this dark hero via the brightness/invert filter. */}
        <div className="flex items-center gap-3 sm:gap-5 mb-8 flex-wrap">
          <Image
            src="/logo-surfstore.png"
            alt="Surf-Store.com"
            width={480}
            height={72}
            className="h-6 sm:h-8 md:h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
          <span className="text-paper/40 font-display text-lg sm:text-xl" style={{ fontWeight: 800 }}>
            ×
          </span>
          <Image
            src="/logo-duotone.png"
            alt="Duotone"
            width={360}
            height={72}
            className="h-5 sm:h-7 md:h-9 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
          <span className="text-paper/40 font-display text-lg sm:text-xl" style={{ fontWeight: 800 }}>
            ×
          </span>
          <Image
            src="/Surfshop_logo.svg"
            alt="Surfshop Ljubljana"
            width={360}
            height={72}
            className="h-5 sm:h-7 md:h-9 w-auto"
            priority
          />
        </div>
        <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-6 border-2 border-gold px-3 py-1.5 bg-ink/40 backdrop-blur-sm">
          📍 {t("eyebrow")}
        </p>
        <h1 className="h-display text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-paper max-w-4xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] break-words">
          {t("title")}
        </h1>
        <p className="font-display uppercase tracking-wide text-xl mt-4 text-paper/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {t("subtitle")}
        </p>
        <p className="mt-10 font-display uppercase text-xl sm:text-2xl md:text-3xl text-gold max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          {t("tagline")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#book" className="btn-primary">{t("ctaPrimary")} →</a>
          <a href="#packages" className="btn-secondary">{t("ctaSecondary")}</a>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-paper/90 text-sm font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold" /> {t("badge1")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold" /> {t("badge2")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gold" /> {t("badge3")}
          </span>
        </div>
      </div>
    </section>
  );
}
