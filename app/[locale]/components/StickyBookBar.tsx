"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Mobile-first persistent CTA. Shows once the user scrolls past the hero,
 * hides when the booking form is in view.
 */
export function StickyBookBar() {
  const t = useTranslations("stickyBar");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("book");
    const heroHeight = window.innerHeight * 0.6;
    let bookInView = false;

    const observer = target
      ? new IntersectionObserver(
          ([entry]) => {
            bookInView = entry?.isIntersecting ?? false;
            update();
          },
          { threshold: 0.1 },
        )
      : null;
    observer?.observe(target!);

    function update() {
      setVisible(window.scrollY > heroHeight && !bookInView);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-ocean/95 backdrop-blur border-t border-white/10 shadow-cardHover">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="text-white">
            <p className="font-display uppercase text-sm tracking-wide leading-tight">
              {t("label")}
            </p>
            <p className="font-mono text-xs text-sun-light hidden sm:block">
              Green Lake, Kidričevo
            </p>
          </div>
          <a href="#book" className="btn-primary text-sm px-5 py-2">
            {t("cta")} →
          </a>
        </div>
      </div>
    </div>
  );
}
