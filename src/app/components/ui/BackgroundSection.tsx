// src/app/components/BackgroundSection.tsx
import Image from "next/image";
import { ReactNode } from "react";

export default function BackgroundSection({
  bg = "/images/featured-bg.jpg",
  dim = 0.6,
  children,
}: {
  bg?: string;
  dim?: number;
  children: ReactNode;
}) {
  return (
    <section className="relative my-8 overflow-hidden border ">
      <Image src={bg} alt="" fill sizes="100vw" priority className="object-cover" />

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${dim})` }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-6 py-8">{children}</div>
    </section>
  );
}
