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
        <div className="flex items-start justify-center gap-4">
            {items.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px]" aria-label="More photos">
                    {items.map((m, i) => {
                        const selected = i === active;
                        return (
                            <button
                                key={`${m.url}-${i}`}
                                onClick={() => setActive(i)}
                                type="button"
                                aria-label={`Show image ${i + 1}`}
                                aria-pressed={selected}
                                className={`relative h-20 w-28 overflow-hidden rounded-lg border ${selected ? "ring-2 ring-brand-orange border-transparent" : "border-black/10"
                                    } focus:outline-none focus:ring-2 focus:ring-brand-orange`}
                            >
                                <Image
                                    src={m.url}
                                    alt={m.alt || `${name} ${i + 1}`}
                                    fill
                                    className="object-cover object-center"
                                    unoptimized
                                    sizes="112px"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-sm "
                aria-label="Open image"
            >
                <Image
                    src={main.url}
                    alt={main.alt || name}
                    fill
                    className="object-cover object-center"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 768px"
                />
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-[min(90vw,1000px)] aspect-[16/9] rounded-xl backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={main.url}
                            alt={main.alt || name}
                            fill
                            className="object-contain object-center rounded-xl"
                            unoptimized
                            sizes="(max-width: 1000px) 90vw"
                        />
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                            className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 text-white hover:bg-black/70"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
