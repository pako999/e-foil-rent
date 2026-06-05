"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MAINTENANCE_VIDEOS } from "@/lib/content";
import type { Locale } from "@/i18n/request";

/**
 * 9-up Duotone Foil Assist maintenance video grid. Each card is a YouTube
 * facade — only the lightweight `hqdefault.jpg` thumbnail loads
 * upfront; the iframe mounts on click so we don't ship 9 embeds on first
 * paint. Per-video titles come from MAINTENANCE_VIDEOS in lib/content.ts.
 */
export function MaintenanceVideos({ locale }: { locale: Locale }) {
  const t = useTranslations("maintenance");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function open(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <section className="bg-cream border-b-2 border-ink">
      <div className="container-x py-20">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">🔧 // {t("eyebrow")}</p>
          <h2 className="h-display text-4xl sm:text-5xl md:text-6xl text-ink mb-3">
            {t("title")}
          </h2>
          <p className="text-graphite text-xl sm:text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MAINTENANCE_VIDEOS.map((v, i) => {
            const isOpen = openIds.has(v.id);
            const thumb = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
            const title = locale === "sl" ? v.sl : v.en;
            return (
              <article
                key={v.id}
                className="border-2 border-ink bg-paper overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video bg-ink">
                  {isOpen ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                      title={title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => open(v.id)}
                      className="group absolute inset-0 w-full h-full cursor-pointer"
                      aria-label={t("playLabel", { title })}
                    >
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover opacity-80 group-hover:opacity-100 transition"
                        unoptimized
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="flex items-center justify-center w-14 h-14 bg-gold border-2 border-ink group-hover:scale-110 transition-transform"
                          style={{ boxShadow: "3px 3px 0 0 #1a1a1a" }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-ink ml-0.5"
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <div className="px-4 py-3 border-t-2 border-ink flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span
                      className="font-mono text-[10px] text-ink/50 uppercase tracking-widest block"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-display uppercase text-sm leading-tight text-ink"
                      style={{ fontWeight: 800 }}
                    >
                      {title}
                    </h3>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-ink/60 hover:text-ink shrink-0 mt-1"
                    aria-label={t("openYoutube")}
                  >
                    ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

