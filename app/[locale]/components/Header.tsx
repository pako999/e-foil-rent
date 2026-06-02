import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/request";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  return (
    <header className="sticky top-0 z-40 bg-foam/85 backdrop-blur border-b border-ocean/10">
      <div className="container-x flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          className="font-display uppercase tracking-tight text-lg text-ocean"
        >
          Surf-Store<span className="text-sun">.</span>e-foil
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-display uppercase text-sm tracking-wide text-ocean/80">
          <a href="#packages" className="hover:text-sun-dark">{t("packages")}</a>
          <a href="#how" className="hover:text-sun-dark">{t("how")}</a>
          <a href="#gallery" className="hover:text-sun-dark">{t("gallery")}</a>
          <a href="#faq" className="hover:text-sun-dark">{t("faq")}</a>
          <a href="#book" className="btn-primary text-xs px-4 py-2">{t("book")}</a>
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
