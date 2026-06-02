import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="relative bg-ocean text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero-placeholder.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ocean/90 via-ocean/40 to-sky/60" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-sun/20 blur-3xl" />
        <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-sky/30 blur-3xl" />
      </div>
      <div className="relative container-x py-20 md:py-32">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sun-light mb-6 bg-white/10 backdrop-blur rounded-full px-4 py-2">
          📍 {t("eyebrow")}
        </p>
        <h1 className="h-display text-5xl sm:text-7xl md:text-8xl text-white max-w-4xl">
          {t("title")}
          <span className="block text-sun">·</span>
        </h1>
        <p className="font-display uppercase tracking-wide text-xl mt-4 text-white/85">
          {t("subtitle")}
        </p>
        <p className="mt-10 font-display uppercase text-2xl md:text-3xl text-sun max-w-3xl">
          {t("tagline")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#book" className="btn-primary">{t("ctaPrimary")} →</a>
          <a href="#packages" className="btn-secondary">{t("ctaSecondary")}</a>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-white/80 text-sm font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sun" /> {t("badge1")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sun" /> {t("badge2")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sun" /> {t("badge3")}
          </span>
        </div>
      </div>
      {/* Wave bottom edge */}
      <svg
        className="block w-full -mb-px"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill="#fffaf0"
        />
      </svg>
    </section>
  );
}
