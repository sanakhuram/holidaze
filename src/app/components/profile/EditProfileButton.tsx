"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileEditModal from "./ProfileEditModal";
import type { Profile } from "@/app/lib/types";
import { Pencil } from "lucide-react";

/**
 * Button to edit a user profile.
 *
 * @param profile - The profile object containing bio, avatar, banner, and venueManager flag.
 * @param iconOnly - If true, renders only the icon without text. Defaults to false.
 *
 * @remarks
 * - Opens `ProfileEditModal` when clicked.
 * - Refreshes the router after saving changes.
 * - Supports two visual variants: icon-only or full text+icon button.
 */

export default function EditProfileButton({
  profile,
  iconOnly = false,
}: {
  profile: Profile;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          iconOnly
            ? "rounded-full bg-amber-600 p-2 text-white shadow hover:bg-amber-500"
            : "bg-wine flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-600"
        }
        aria-label="Edit profile"
      >
        <Pencil className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
        {!iconOnly && "Edit profile"}
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
