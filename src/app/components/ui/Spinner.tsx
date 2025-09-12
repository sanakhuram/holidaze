// src/app/components/ui/Spinner.tsx
export default function Spinner({ size = 10 }: { size?: number }) {
  return (
    <div
      className={`h-${size} w-${size} animate-spin rounded-full border-4 border-amber-500 border-t-transparent`}
    />
  );
}
