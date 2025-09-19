// src/app/components/AboutUs.tsx
import Image from "next/image";
import BackToVenues from "../components/ui/BackToVenues";

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
    <section
      aria-labelledby="about-title"
      className="relative flex min-h-[70vh] items-center overflow-hidden sm:min-h-[80vh] md:min-h-screen"
    >
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

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-5xl px-4 text-left sm:px-6 lg:px-8">
          {headingLevel === "h1" ? (
            <h1
              id="about-title"
              className="[font-size:clamp(1.75rem,4vw,3.5rem)] font-extrabold text-white drop-shadow"
            >
              About Holidaze Venues
            </h1>
          ) : (
            <h2
              id="about-title"
              className="[font-size:clamp(1.75rem,4vw,3.5rem)] font-extrabold text-white drop-shadow"
            >
              About Holidaze Venues
            </h2>
          )}

          <h3 className="mt-3 [font-size:clamp(1.1rem,2vw,1.75rem)] font-semibold text-amber-200 drop-shadow">
            Simple booking. Thoughtful design. No surprises.
          </h3>

          <p className="mt-5 max-w-3xl [font-size:clamp(0.95rem,1.3vw,1.125rem)] leading-relaxed text-white/90">
            Holidaze Venues keeps travel straightforward: clear venue details, fast pages, and
            booking that just works. Hosts get easy tools to list and manage; guests get trustworthy
            info and a <span className="font-semibold">Nordic Gems</span> spotlight to find
            standouts.
          </p>

          <p className="mt-3 max-w-3xl [font-size:clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-white/85">
            We focus on the basics done right—reliable search, honest content, and responsive
            layouts—while building for what’s next with smarter filters and smoother flows.
          </p>

          <ul className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "Clear availability, guest limits, and house rules",
              "Fast, readable UI across devices",
              "Helpful host tools to create and manage venues",
              <>
                Local flavor with <em>Nordic Gems</em> up top
              </>,
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 [font-size:clamp(0.9rem,1.2vw,1rem)] text-white/90"
              >
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-amber-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute top-4 left-4 z-20">
        <BackToVenues className="hover:bg-coffee/60 rounded-full px-3 py-1 text-amber-200 hover:text-amber-300" />
      </div>
    </section>
  );
}
