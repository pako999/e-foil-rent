import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SITE, LEGAL_PAGES } from "@/lib/content";
import type { Locale } from "@/i18n/request";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations("footer");
  const tLegal = await getTranslations("footer.legal");

  return (
    <footer className="bg-ink text-paper pb-16 lg:pb-0 border-t-2 border-ink">
      <div className="container-x py-16 grid md:grid-cols-3 gap-12">
        {/* COL 1 — brand + partner */}
        <div>
          <a
            href={SITE.mainSite}
            target="_blank"
            rel="noreferrer"
            aria-label="Surf-Store.com"
          >
            <Image
              src="/logo-surfstore.png"
              alt="Surf-Store.com"
              width={480}
              height={72}
              className="h-7 sm:h-8 md:h-9 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </a>
          <p className="text-paper/70 max-w-xs mt-4">{t("tagline")}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="font-mono text-xs text-paper/50">
              {t("partner")}
            </span>
            <Image
              src="/logo-duotone.png"
              alt="Duotone"
              width={360}
              height={72}
              className="h-6 w-auto opacity-90"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          <a
            href={SITE.mainSite}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 font-mono text-xs text-gold hover:text-gold-light"
          >
            {t("visitMain")} ↗
          </a>
        </div>

        {/* COL 2 — company info + contact */}
        <div>
          <p
            className="font-display uppercase tracking-widest text-xs text-paper/60 mb-3"
            style={{ fontWeight: 800 }}
          >
            {t("companyLabel")}
          </p>
          <p className="font-display uppercase text-base text-paper" style={{ fontWeight: 800 }}>
            {SITE.company.name}
          </p>
          <address className="not-italic font-mono text-sm text-paper/70 mt-1 leading-relaxed">
            {SITE.company.address}<br />
            {SITE.company.postal}<br />
            {SITE.company.country}
          </address>
          <p className="font-mono text-xs text-paper/60 mt-2">
            {t("vatLabel")}: {SITE.company.vatId}
          </p>

          <p
            className="font-display uppercase tracking-widest text-xs text-paper/60 mt-6 mb-3"
            style={{ fontWeight: 800 }}
          >
            {t("contact")}
          </p>
          <ul className="space-y-1">
            <li>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="hover:text-gold"
              >
                {SITE.contactEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phoneRaw}`} className="hover:text-gold font-mono text-sm">
                {SITE.phone}
              </a>
            </li>
          </ul>
        </div>

        {/* COL 3 — social + lang + legal */}
        <div>
          <p
            className="font-display uppercase tracking-widest text-xs text-paper/60 mb-3"
            style={{ fontWeight: 800 }}
          >
            {t("follow")}
          </p>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center w-11 h-11 border-2 border-paper hover:bg-gold hover:border-gold hover:text-ink text-paper transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          <div className="mt-6">
            <LanguageSwitcher currentLocale={locale} variant="dark" />
          </div>

          <p
            className="font-display uppercase tracking-widest text-xs text-paper/60 mt-8 mb-3"
            style={{ fontWeight: 800 }}
          >
            {t("legalLabel")}
          </p>
          <ul className="space-y-1.5 text-sm">
            {LEGAL_PAGES.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${locale}/legal/${slug}`}
                  className="text-paper/80 hover:text-gold"
                >
                  {tLegal(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t-2 border-paper/10 py-4">
        <div className="container-x flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-paper/50">
          <span>
            © {new Date().getFullYear()} {SITE.company.name} — {t("rights")}
          </span>
          <span>{SITE.company.vatId} · {SITE.company.address}, {SITE.company.postal}</span>
        </div>
      </div>
    </footer>
  );
}
