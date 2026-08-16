import { cn } from "@/lib/utils";

/**
 * Skeleton — a low-cost loading placeholder.
 *
 * Uses a subtle pulse on the muted surface so image-heavy lists (Library,
 * Inspiration) can reserve their layout box before the real asset loads,
 * eliminating cumulative layout shift (CLS).
 */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-sm bg-muted", className)}
    />
  );
}

export { Skeleton };
