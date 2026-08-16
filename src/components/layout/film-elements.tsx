import { cn } from "@/lib/utils";

/**
 * Film-craft signature elements
 * ------------------------------------------------------------------
 * Small, theme-aware decorative components that give VibeVideo a
 * "film studio" identity instead of generic AI-card styling. All marks
 * are pure CSS (no images, no runtime cost) and inherit the light/dark
 * theme via the CSS variables defined in globals.css.
 *
 * - Timecode       monospace readout for metadata
 * - RecBadge       blinking "REC" recording indicator
 */

export function Timecode({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={cn("timecode text-xs", className)} aria-label={value}>
      {value}
    </span>
  );
}

export function RecBadge({
  active = true,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "timecode inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em]",
        className
      )}
    >
      <span className={cn("rec-dot", !active && "opacity-40 [animation:none]")} />
      REC
    </span>
  );
}
