import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SITE } from "@/lib/content";
import type { Locale } from "@/i18n/request";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  return (
    <footer className="bg-ocean-deep text-white pb-16 lg:pb-0">
      <div className="container-x py-16 grid md:grid-cols-3 gap-12">
        <div>
          <p className="font-display uppercase tracking-tight text-2xl mb-3">
            Surf-Store<span className="text-sun">.</span>com
          </p>
          <p className="text-white/70 max-w-xs">{t("tagline")}</p>
          <a
            href={SITE.mainSite}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 font-mono text-xs text-sun hover:text-sun-light"
          >
            {t("visitMain")} ↗
          </a>
        </div>
        <div>
          <p className="font-display uppercase tracking-widest text-xs text-white/60 mb-3">
            {t("contact")}
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="block hover:text-sun"
          >
            {SITE.contactEmail}
          </a>
        </div>
        <div>
          <p className="font-display uppercase tracking-widest text-xs text-white/60 mb-3">
            {t("follow")}
          </p>
          <div className="flex flex-col gap-1">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sun"
            >
              Instagram
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sun"
            >
              Facebook
            </a>
          </div>
          <div className="mt-6">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs font-mono text-white/40">
        © {new Date().getFullYear()} Surf-Store.com — {t("rights")}
      </div>
    </footer>
  );
}
