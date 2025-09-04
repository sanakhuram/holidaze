// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold text-amber-600">404 - Page Not Found</h1>
        <p className="mt-2 text-neutral-600">Sorry, we couldn’t find that page.</p>
      </div>
    </div>
  );
}
