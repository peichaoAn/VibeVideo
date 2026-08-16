"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type GenerateView = "generate" | "inspiration";

interface ViewSwitcherProps {
  value: GenerateView;
  onChange: (value: GenerateView) => void;
  options: { value: GenerateView; label: string; icon: LucideIcon }[];
  className?: string;
}

/**
 * ViewSwitcher — an iOS-style segmented control for toggling between the
 * "Generate" workbench and the "Inspiration" gallery on mobile.
 *
 * A compact, self-sizing pill with a sliding active thumb, icon + label
 * pairing, and a subtle scale/fade motion on selection — matching the
 * premium toC pattern used by Pinterest / Runway / Instagram rather than a
 * plain two-button strip.
 */
export function ViewSwitcher({ value, onChange, options, className }: ViewSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Generate view"
      className={cn(
        "relative inline-flex w-full items-center gap-1 rounded-full border border-border bg-muted/70 p-1 backdrop-blur-sm",
        className
      )}
    >
      {options.map((option) => {
        const active = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                active ? "text-accent-warm" : "text-muted-foreground/70"
              )}
            />
            {option.label}
            {/* Sliding active thumb */}
            {active && (
              <span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm ring-1 ring-border/60"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
