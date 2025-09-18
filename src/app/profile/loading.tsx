// src/app/profile/loading.tsx
import Spinner from "@/app/components/ui/Spinner";

export default function LoadingProfile() {
  return (
    <main className="mx-auto flex max-w-6xl items-center justify-center py-20">
      <Spinner size={48} />
    </main>
  );
}
