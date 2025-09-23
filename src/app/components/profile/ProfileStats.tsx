"use client";

type ProfileStatsProps = {
  email?: string | null;
  bio?: string | null;
  upcomingBookings: number;
  venueCount: number;
};

export default function ProfileStats({
  email,
  bio,
  upcomingBookings,
  venueCount,
}: ProfileStatsProps) {
  return (
    <>

      <div className="grid gap-6 sm:hidden">
        {email && (
          <div>
            <div className="text-xs text-slate-600">Email:</div>
            <div className="truncate text-sm font-medium break-words">{email}</div>
          </div>
        )}

        {bio && (
          <div>
            <div className="text-xs text-slate-600">Bio:</div>
            <div className="text-sm font-medium break-words whitespace-pre-wrap">{bio}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-slate-600">Bookings:</div>
            <div className="text-sm font-semibold">{upcomingBookings}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600">Venues:</div>
            <div className="text-sm font-semibold">{venueCount}</div>
          </div>
        </div>
      </div>

      <div className="hidden grid-cols-1 gap-6 sm:grid sm:grid-cols-2 md:grid-cols-4">
        {email && (
          <div>
            <div className="text-xs text-slate-600">Email:</div>
            <div className="truncate text-sm font-medium break-words">{email}</div>
          </div>
        )}

        {bio && (
          <div>
            <div className="text-xs text-slate-600">Bio:</div>
            <div className="text-sm font-medium break-words whitespace-pre-wrap">{bio}</div>
          </div>
        )}

        <div>
          <div className="text-xs text-slate-600">Bookings:</div>
          <div className="text-sm font-semibold">{upcomingBookings}</div>
        </div>
        <div>
          <div className="text-xs text-slate-600">Venues:</div>
          <div className="text-sm font-semibold">{venueCount}</div>
        </div>
      </div>
    </>
  );
}
