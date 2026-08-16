import { cn } from "@/lib/utils";

/**
 * VibeVideo logo mark — a minimal geometric "play" glyph inside a charcoal
 * rounded square, with a warm amber accent. Reads as a premium film/studio
 * identity rather than a generic AI app icon.
 */
export function Logo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-primary shadow-sm",
        className ?? "h-8 w-8"
      )}
    >
      {/* Warm amber play triangle */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn("text-accent-warm", iconClassName ?? "h-4 w-4")}
        aria-hidden="true"
      >
        <path
          d="M8 5.5v13a1 1 0 0 0 1.54.84l10.5-6.5a1 1 0 0 0 0-1.68L9.54 4.66A1 1 0 0 0 8 5.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
