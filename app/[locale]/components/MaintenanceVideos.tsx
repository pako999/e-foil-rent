"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MAINTENANCE_VIDEOS } from "@/lib/content";

/**
 * 8-up Duotone Foil Assist maintenance video grid. Each card is a YouTube
 * facade — only the lightweight `maxresdefault.jpg` thumbnail loads
 * upfront; the iframe mounts on click so we don't ship 8 embeds on first
 * paint.
 */
export function MaintenanceVideos() {
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
          {MAINTENANCE_VIDEOS.map((id, i) => {
            const isOpen = openIds.has(id);
            const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            return (
              <article
                key={id}
                className="border-2 border-ink bg-paper overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video bg-ink">
                  {isOpen ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                      title={t("videoLabel", { n: i + 1 })}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => open(id)}
                      className="group absolute inset-0 w-full h-full cursor-pointer"
                      aria-label={t("playLabel", { n: i + 1 })}
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
                <div className="px-4 py-3 border-t-2 border-ink flex items-center justify-between">
                  <span
                    className="font-display uppercase tracking-widest text-xs text-ink"
                    style={{ fontWeight: 800 }}
                  >
                    {String(i + 1).padStart(2, "0")} · {t("videoLabel", { n: i + 1 })}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-ink/60 hover:text-ink"
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
