"use client";

import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterBarProps<T extends string> {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * FilterBar — a reusable segmented filter row shared by Library and
 * Inspiration. Sharp-cornered, timecode-labelled chips that sit above a
 * bottom border, matching the film-slate aesthetic.
 */
export function FilterBar<T extends string>({
  value,
  options,
  onChange,
  className,
}: FilterBarProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-none border-b border-border pb-4",
        className
      )}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "timecode cursor-pointer whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
