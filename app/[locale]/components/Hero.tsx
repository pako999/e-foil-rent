import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero-placeholder.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/90" />
      </div>
      <div className="relative container-x py-24 md:py-36">
        <p className="font-mono text-xs uppercase tracking-widest text-teal mb-6">
          {t("eyebrow")}
        </p>
        <h1 className="h-display text-5xl sm:text-7xl md:text-8xl text-white max-w-4xl">
          {t("title")}
        </h1>
        <p className="font-display uppercase tracking-wide text-xl mt-4 text-white/80">
          {t("subtitle")}
        </p>
        <p className="mt-10 font-display uppercase text-2xl md:text-3xl text-teal max-w-3xl">
          {t("tagline")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#book" className="btn-primary">{t("ctaPrimary")}</a>
          <a href="#how" className="btn-secondary">{t("ctaSecondary")}</a>
        </div>
      </div>
    </section>
  );
}
