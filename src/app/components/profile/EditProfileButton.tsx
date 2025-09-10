// src/app/profile/EditProfileButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileEditModal from "./ProfileEditModal";
import type { Profile } from "@/app/lib/types";
import { Pencil } from "lucide-react";

export default function EditProfileButton({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md bg-wine px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90"
      >
        <Pencil className="h-4 w-4" />
        Edit profile
      </button>

      <ProfileEditModal
        open={open}
        onClose={() => setOpen(false)}
        initial={{
          bio: profile.bio ?? "",
          avatar: profile.avatar ?? null,
          banner: profile.banner ?? null,
          venueManager: !!profile.venueManager,
        }}
        onSaved={() => {
          router.refresh();
        }}
      />
    </>
  );
}
