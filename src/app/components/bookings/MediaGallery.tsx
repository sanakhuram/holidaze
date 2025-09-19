"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@/app/lib/types";

const PLACEHOLDER = "/placeholder.jpg";

export default function MediaGallery({ media, name }: { media: Media[]; name: string }) {
  const items = (media?.length ? media : [{ url: PLACEHOLDER, alt: name }]) as Media[];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const main = items[active];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      {items.length > 1 && (
        <div className="hidden max-h-[400px] flex-col gap-2 overflow-y-auto md:flex">
          {items.map((m, i) => {
            const selected = i === active;
            return (
              <button
                key={`${m.url}-${i}`}
                onClick={() => setActive(i)}
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-pressed={selected}
                className={`relative h-20 w-28 overflow-hidden rounded-lg border ${
                  selected ? "ring-brand-orange border-transparent ring-2" : "border-black/10"
                } focus:ring-brand-orange focus:ring-2 focus:outline-none`}
              >
                <Image
                  src={m.url}
                  alt={m.alt || `${name} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block h-[400px] w-full overflow-hidden rounded-md sm:h-[500px]"
          aria-label="Open image"
        >
          <Image
            src={main.url}
            alt={main.alt || name}
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 768px, 1024px"
            priority
          />
        </button>

        {items.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2 md:hidden">
            {items.map((m, i) => {
              const selected = i === active;
              return (
                <button
                  key={`${m.url}-${i}`}
                  onClick={() => setActive(i)}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={selected}
                  className={`relative h-20 w-24 overflow-hidden rounded-lg border ${
                    selected ? "ring-brand-orange border-transparent ring-2" : "border-black/10"
                  } focus:ring-brand-orange focus:ring-2 focus:outline-none`}
                >
                  <Image
                    src={m.url}
                    alt={m.alt || `${name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={main.url}
              alt={main.alt || name}
              fill
              className="rounded-xl object-contain"
              sizes="90vw"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="hover:bg-wine/70 absolute top-3 right-3 rounded-md bg-amber-500/80 px-2 py-1 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
