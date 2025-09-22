// src/app/components/ui/Spinner.tsx
export default function Spinner({ size = 48 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="animate-spin rounded-full border-4 border-amber-500 border-t-amber-200"
    />
  );
}

