/* eslint-disable @next/next/no-img-element */
// src/app/components/ProfileEditModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/hooks/useSession";

type ImgObj = { url?: string; alt?: string };
type Initial = {
    bio?: string;
    avatar?: ImgObj | null;
    banner?: ImgObj | null;
    venueManager?: boolean;
};

export default function ProfileEditModal({
    open,
    onClose,
    initial,
    onSaved,
}: {
    open: boolean;
    onClose: () => void;
    initial?: Initial;
    onSaved?: () => void | Promise<void>;
}) {
    const { refresh } = useSession();

    const [bio, setBio] = useState(initial?.bio ?? "");
    const [avatarUrl, setAvatarUrl] = useState(initial?.avatar?.url ?? "");
    const [avatarAlt, setAvatarAlt] = useState(initial?.avatar?.alt ?? "");
    const [bannerUrl, setBannerUrl] = useState(initial?.banner?.url ?? "");
    const [bannerAlt, setBannerAlt] = useState(initial?.banner?.alt ?? "");
    const [venueManager, setVenueManager] = useState(!!initial?.venueManager);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setBio(initial?.bio ?? "");
            setAvatarUrl(initial?.avatar?.url ?? "");
            setAvatarAlt(initial?.avatar?.alt ?? "");
            setBannerUrl(initial?.banner?.url ?? "");
            setBannerAlt(initial?.banner?.alt ?? "");
            setVenueManager(!!initial?.venueManager);
            setErr(null);
            setOk(null);
        }
    }, [open, initial]);

    const isValidUrl = (s: string) => {
        if (!s) return true;
        try {
            const u = new URL(s);
            return u.protocol === "http:" || u.protocol === "https:";
        } catch {
            return false;
        }
    };

    const avatarUrlValid = useMemo(() => isValidUrl(avatarUrl), [avatarUrl]);
    const bannerUrlValid = useMemo(() => isValidUrl(bannerUrl), [bannerUrl]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOk(null);

        if (!avatarUrlValid || !bannerUrlValid) {
            setErr("Please enter valid http(s) image URLs.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                bio,
                avatar: { url: avatarUrl || "", alt: avatarAlt || "" },
                banner: { url: bannerUrl || "", alt: bannerAlt || "" },
                venueManager,
            };

            const r = await fetch("/api/profile/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const rd = await r.json();
            if (!r.ok) {
                throw new Error(rd?.errors?.[0]?.message || rd?.message || "Update failed");
            }

            setOk("Profile updated.");
            await refresh();
            await (onSaved?.() ?? Promise.resolve());
            setTimeout(onClose, 500);
        } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"}`}
            />
            <div
                className={`absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-[var(--background)] p-6 text-slate-900 shadow-xl transition ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
            >
                <div className="mb-4 flex items-center justify-between max-h-[90vh] overflow-y">
                    <h2 className="text-lg font-semibold">Edit profile</h2>
                    <button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-slate-100">
                        ✕
                    </button>
                </div>

                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                {ok && <p className="mb-3 text-sm text-emerald-700">{ok}</p>}

                <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Banner URL</label>
                        <input
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${bannerUrlValid ? "border-slate-300" : "border-red-400"
                                }`}
                            placeholder="https://…"
                        />
                        <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">Banner Alt</label>
                        <input
                            value={bannerAlt}
                            onChange={(e) => setBannerAlt(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Banner description"
                        />
                        <div className="mt-3 h-28 overflow-hidden rounded-lg border bg-slate-50">
                            {bannerUrl ? (
                                <img src={bannerUrl} alt={bannerAlt} className="h-full w-full object-cover" />
                            ) : (
                                <div className="grid h-full place-items-center text-xs text-slate-500">
                                    Banner preview
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Avatar URL</label>
                        <input
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm ${avatarUrlValid ? "border-slate-300" : "border-red-400"
                                }`}
                            placeholder="https://…"
                        />
                        <label className="mt-2 mb-1 block text-xs font-medium text-slate-600">Avatar Alt</label>
                        <input
                            value={avatarAlt}
                            onChange={(e) => setAvatarAlt(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Avatar description"
                        />
                        <div className="mt-3 flex items-center gap-3">
                            <div className="h-16 w-16 overflow-hidden rounded-xl border bg-slate-50">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={avatarAlt} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="grid h-full place-items-center text-[10px] text-slate-500">
                                        Avatar
                                    </div>
                                )}
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={venueManager}
                                    onChange={(e) => setVenueManager(e.target.checked)}
                                />
                                Venue manager
                            </label>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="h-28 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
                            placeholder="Tell guests about yourself…"
                        />
                    </div>

                    <div className="lg:col-span-2 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50 shadow-md"
                        >
                            {loading ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
