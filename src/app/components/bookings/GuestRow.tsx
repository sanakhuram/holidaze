export default function GuestsRow({
  maxGuests,
  guests,
  onChange,
  summary,
}: {
  maxGuests: number;
  guests: number;
  onChange: (n: number) => void;
  summary: string;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
      <label>
        <span className="mb-1 block text-amber-200/80">Guests</span>
        <input
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-coffee/40 w-full rounded-md border border-amber-600/30 px-3 py-2 text-amber-50 placeholder-amber-200/50"
          placeholder="1"
        />
      </label>
      <div className="flex items-end justify-end text-amber-200/80">{summary}</div>
    </div>
  );
}
