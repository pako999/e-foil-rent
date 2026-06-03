import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative bg-ink text-paper overflow-hidden border-b-2 border-ink">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-ink/40 to-ink/85" />
      </div>
      <div className="relative container-x py-20 md:py-32">
        <p className="inline-flex items-center gap-2 font-display uppercase tracking-widest text-xs text-gold mb-6 border-2 border-gold px-3 py-1.5">
          📍 {t("eyebrow")}
        </p>
        <h1 className="h-display text-6xl sm:text-8xl md:text-9xl text-paper max-w-4xl">
          {t("title")}
        </h1>
        <p className="font-display uppercase tracking-wide text-xl mt-4 text-paper/85">
          {t("subtitle")}
        </p>
        <p className="mt-10 font-display uppercase text-2xl md:text-3xl text-gold max-w-3xl">
          {t("tagline")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#book" className="btn-primary">{t("ctaPrimary")} →</a>
          <a href="#packages" className="btn-secondary">{t("ctaSecondary")}</a>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-paper/85 text-sm font-mono">
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
