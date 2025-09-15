"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroIntro() {
  const [closing, setClosing] = useState(false);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== "undefined") {
      router.prefetch?.("/venues");
    }
  }, [router]);

  const navigate = useCallback(() => {
    if (prefersReducedMotion) {
      router.push("/venues");
      return;
    }
    if (!closing) setClosing(true);
  }, [closing, prefersReducedMotion, router]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  const trans = { duration: 0.6, ease: [0.76, 0, 0.24, 1] } as const;

  return (
    <section
      role="button"
      tabIndex={0}
      aria-label="Open venues"
      onClick={navigate}
      onKeyDown={onKeyDown}
      className="bg-coffee relative isolate flex h-[40vh] w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 sm:h-[50vh] md:h-[68vh] lg:h-[90vh]"
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="bg-coffee pointer-events-none absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={closing ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.div
        initial={{ x: 0 }}
        animate={closing && !prefersReducedMotion ? { x: "-50%" } : { x: 0 }}
        transition={trans}
        className="relative z-10 h-full w-1/2"
        onAnimationComplete={() => {
          if (closing && !prefersReducedMotion) router.push("/venues");
        }}
      >
        <Image
          src="/images/hero-right.jpg"
          alt="Beach sunset right"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover md:mix-blend-color-burn"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ x: 0 }}
        animate={closing && !prefersReducedMotion ? { x: "50%" } : { x: 0 }}
        transition={trans}
        className="relative z-10 h-full w-1/2"
      >
        <Image
          src="/images/hero-left.jpg"
          alt="Beach sunset left"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/15 px-3 sm:bg-black/20 md:bg-black/25">
        <h1 className="text-center [font-size:clamp(0.85rem,2.9vw,1.6rem)] leading-tight font-extrabold text-amber-200 drop-shadow-lg md:[font-size:clamp(1.1rem,2.1vw,2.2rem)] lg:[font-size:clamp(1.25rem,1.8vw,2.5rem)]">
          Unfold Your Next Escape
        </h1>
      </div>
    </section>
  );
}
