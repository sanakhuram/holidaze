"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, useReducedMotion, cubicBezier, type Transition } from "framer-motion";
import type { Route } from "next";
import Loader from "./Loader";

type Panel = {
    src: string;
    alt: string;
    closeX: "-50%" | "50%";
};

const PANELS: Panel[] = [
    { src: "/images/hero-right.jpg", alt: "Beach sunset right", closeX: "-50%" },
    { src: "/images/hero-left.jpg", alt: "Beach sunset left", closeX: "50%" },
];

export default function HeroIntro() {
    const [closing, setClosing] = useState(false);
    const router = useRouter();
    const prefersReducedMotion = useReducedMotion();

    const ease = cubicBezier(0.76, 0, 0.24, 1);
    const transition: Transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease };

    const go = useCallback(() => {
        if (closing) return;
        setClosing(true);
        setTimeout(() => router.push("/venues" as Route), 700);

    }, [closing, router]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            go();
        }
    };

    return (
        <section
            role="button"
            tabIndex={0}
            aria-label="Open venues"
            onClick={go}
            onKeyDown={onKeyDown}
            className="relative isolate flex h-[40vh] w-full cursor-pointer overflow-hidden bg-coffee
            sm:h-[50vh] md:h-[68vh] lg:h-[90vh]"
        >
            {PANELS.map(({ src, alt, closeX }, i) => (
                <motion.div
                    key={src}
                    initial={{ x: 0 }}
                    animate={closing ? { x: closeX } : { x: 0 }}
                    transition={transition}
                    className="relative z-10 h-full w-1/2"
                    style={{ willChange: "transform" }}
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
                        className="object-cover"
                    />
                </motion.div>
            ))}

            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-coffee to-wine"
                initial={{ opacity: 0 }}
                animate={closing ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            />

            <div className="absolute inset-0 z-30 flex items-center justify-center px-3 bg-black/15 sm:bg-black/20 md:bg-black/25">
                <h1 className="text-center font-extrabold leading-tight text-[var(--background)] drop-shadow-lg
                        [font-size:clamp(0.85rem,2.9vw,1.6rem)]
                        md:[font-size:clamp(1.1rem,2.1vw,2.2rem)]
                        lg:[font-size:clamp(1.25rem,1.8vw,2.5rem)]">
                    Unfold Your Next Escape
                </h1>
            </div>
            {closing && (
  <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-r from-coffee to-wine">
    <Loader />
  </div>
)}
        </section>
    );
}
