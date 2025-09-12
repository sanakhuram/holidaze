// src/app/venues/[id]/loading.tsx
import Spinner from "@/app/components/ui/Spinner";

export default function LoadingVenueDetail() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center py-20">
      <Spinner size={10} />
    </div>
  );
}
