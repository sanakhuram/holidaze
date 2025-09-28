"use client";

import { DayPicker } from "react-day-picker";
import type { DateRange, Matcher } from "react-day-picker";

type Props = {
  value: DateRange;
  onChange: (range: DateRange | undefined) => void;
  disabled?: Matcher | Matcher[];
  numberOfMonths?: number;
  className?: string;
};

/**
 * Calendar component for selecting a range of dates.
 *
 * @param value - The currently selected date range.
 * @param onChange - Callback triggered when the selection changes.
 * @param disabled - Dates or ranges that should be disabled.
 * @param numberOfMonths - Number of months visible in the calendar (default 1).
 * @param className - Optional custom styling classes.
 *
 * @remarks
 * - Wraps `react-day-picker` in "range" mode.
 * - `defaultMonth` is set to the start of the current range for convenience.
 */

export default function CalendarRange({
  value,
  onChange,
  disabled,
  numberOfMonths = 1,
  className,
}: Props) {
  return (
    <DayPicker
      mode="range"
      selected={value}
      onSelect={onChange}
      disabled={disabled}
      numberOfMonths={numberOfMonths}
      defaultMonth={value?.from}
      className={className}
    />
  );
}
