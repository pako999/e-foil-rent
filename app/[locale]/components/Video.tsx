"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SITE } from "@/lib/content";

/**
 * YouTube "facade": shows a still + play button until clicked, then swaps
 * to the heavy iframe. Saves ~500KB on initial load and lets the page hit
 * green Lighthouse scores even with embedded video.
 */
export function Video() {
  const t = useTranslations("video");
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${SITE.videoId}/maxresdefault.jpg`;

  return (
    <section className="bg-cream border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">▶ // {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-xl sm:text-lg">{t("subtitle")}</p>
        </div>
        <div
          className="relative w-full aspect-video border-2 border-ink overflow-hidden bg-ink"
          style={{ boxShadow: "8px 8px 0 0 #1a1a1a" }}
        >
          {open ? (
            <iframe
              src={`https://www.youtube.com/embed/${SITE.videoId}?autoplay=1&rel=0`}
              title="E-foil video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group absolute inset-0 w-full h-full cursor-pointer"
              aria-label={t("playLabel")}
            >
              <Image
                src={thumb}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-80 group-hover:opacity-100 transition"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center w-20 h-20 bg-gold border-2 border-ink group-hover:scale-110 transition-transform" style={{ boxShadow: "4px 4px 0 0 #1a1a1a" }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ink ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
