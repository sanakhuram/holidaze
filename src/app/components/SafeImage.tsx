/* eslint-disable @next/next/no-img-element */
"use client";

export default function SafeImage({
  src,
  alt = "",
  className,
  placeholder = "/placeholder.jpg",
  loading = "lazy",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  placeholder?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <img
      src={src || placeholder}
      alt={alt}
      className={className}
      loading={loading}
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
