import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/request";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink/10">
      <div className="container-x flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          className="font-display uppercase tracking-tight text-lg text-ink"
        >
          Surf-Store<span className="text-teal">.</span>e-foil
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-display uppercase text-sm tracking-wide">
          <a href="#boards" className="hover:text-teal-dark">{t("boards")}</a>
          <a href="#how" className="hover:text-teal-dark">{t("how")}</a>
          <a href="#location" className="hover:text-teal-dark">{t("location")}</a>
          <a href="#book" className="btn-ghost px-4 py-2 text-xs">{t("book")}</a>
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
