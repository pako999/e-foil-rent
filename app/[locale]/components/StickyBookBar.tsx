"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
      <div className="bg-ink border-t-2 border-gold">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="text-paper">
            <p className="font-display uppercase text-sm tracking-wide leading-tight" style={{ fontWeight: 800 }}>
              {t("label")}
            </p>
            <p className="font-mono text-xs text-gold hidden sm:block">
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
