import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/request";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
      <div className="container-x flex items-center justify-between h-16">
        <Link
          href={`/${locale}`}
          className="font-display uppercase tracking-tight text-lg text-ink"
          style={{ fontWeight: 900 }}
        >
          Surf-Store<span className="text-gold">.</span>e-foil
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-display uppercase text-sm tracking-wide text-ink/80" style={{ fontWeight: 700 }}>
          <a href={`/${locale}#packages`} className="hover:text-ink">{t("packages")}</a>
          <Link href={`/${locale}/efoil`} className="hover:text-ink">{t("efoil")}</Link>
          <Link href={`/${locale}/duotone`} className="hover:text-ink">{t("duotone")}</Link>
          <a href={`/${locale}#how`} className="hover:text-ink">{t("how")}</a>
          <a href={`/${locale}#specs`} className="hover:text-ink">{t("specs")}</a>
          <a href={`/${locale}#gallery`} className="hover:text-ink">{t("gallery")}</a>
          <a href={`/${locale}#faq`} className="hover:text-ink">{t("faq")}</a>
          <a href={`/${locale}#book`} className="btn-primary text-xs px-4 py-2">{t("book")}</a>
        </nav>
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </header>
  );
}
