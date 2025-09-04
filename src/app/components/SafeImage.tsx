/* eslint-disable @next/next/no-img-element */
"use client";

export default function SafeImage({
  src,
  alt = "",
  className,
  placeholder = "/placeholder.jpg",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <img
      src={src || placeholder}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.dataset.fallback !== "1") {
          img.dataset.fallback = "1";
          img.src = placeholder;
        }
      }}
    />
  );
}
