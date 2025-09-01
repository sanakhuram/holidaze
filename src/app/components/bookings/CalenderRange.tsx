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
