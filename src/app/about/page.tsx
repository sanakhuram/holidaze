// src/app/components/AboutUs.tsx
import Image from "next/image";

type HeadingLevel = "h1" | "h2";

export default function AboutUs({
  imgSrc = "/images/about.jpg",
  dim = 0.5,
  headingLevel = "h1",
}: {
  imgSrc?: string;
  dim?: number;
  headingLevel?: HeadingLevel;
}) {
  const d = Math.max(0, Math.min(1, dim));
  const side = Math.max(d - 0.15, 0);

  return (
    <section aria-labelledby="about-title" className="relative  overflow-hidden">
      <Image src={imgSrc} alt="" fill priority sizes="100vw" className="object-cover" />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg,
            rgba(var(--coffee-rgb), ${d}) 0%,
            rgba(var(--coffee-rgb), ${side}) 40%,
            rgba(var(--coffee-rgb), 0) 100%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${side})` }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          {headingLevel === "h1" ? (
            <h1
              id="about-title"
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow"
            >
              About Holidaze Venues
            </h1>
          ) : (
            <h2
              id="about-title"
              className="text-4xl md:text-5xl font-extrabold text-white drop-shadow"
            >
              About Holidaze Venues
            </h2>
          )}

          <h3 className="mt-3 text-xl md:text-2xl font-semibold text-amber-200 drop-shadow">
            Simple booking. Thoughtful design. No surprises.
          </h3>

          <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-white/90">
            Holidaze Venues keeps travel straightforward: clear venue details, fast pages, and
            booking that just works. Hosts get easy tools to list and manage; guests get trustworthy
            info and a <span className="font-semibold">Nordic Gems</span> spotlight to find
            standouts.
          </p>

          <p className="mt-3 max-w-3xl text-white/85 leading-relaxed">
            We focus on the basics done right—reliable search, honest content, and responsive
            layouts—while building for what’s next with smarter filters and smoother flows.
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2 max-w-3xl">
            <li className="flex items-start gap-2 text-white/90">
              <span className="mt-2 inline-block h-2 w-2 rounded-full bg-amber-300" />
              <span>Clear availability, guest limits, and house rules</span>
            </li>
            <li className="flex items-start gap-2 text-white/90">
              <span className="mt-2 inline-block h-2 w-2 rounded-full bg-amber-300" />
              <span>Fast, readable UI across devices</span>
            </li>
            <li className="flex items-start gap-2 text-white/90">
              <span className="mt-2 inline-block h-2 w-2 rounded-full bg-amber-300" />
              <span>Helpful host tools to create and manage venues</span>
            </li>
            <li className="flex items-start gap-2 text-white/90">
              <span className="mt-2 inline-block h-2 w-2 rounded-full bg-amber-300" />
              <span>
                Local flavor with <em>Nordic Gems</em> up top
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="invisible h-[360px] md:h-[480px]" aria-hidden />
    </section>
  );
}
