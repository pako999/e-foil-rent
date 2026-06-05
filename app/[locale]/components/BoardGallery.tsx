"use client";

import Image from "next/image";
import { useState } from "react";

export type GalleryImage = { src: string; alt: string };

export function BoardGallery({ images }: { images: readonly GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-cream overflow-hidden flex-1 min-h-0">
        <Image
          key={main!.src}
          src={main!.src}
          alt={main!.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-1 border-t-2 border-ink">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden bg-cream border-r-2 last:border-r-0 border-ink transition ${
                i === active ? "ring-4 ring-inset ring-gold" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
