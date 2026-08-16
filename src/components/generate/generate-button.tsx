"use client";

import { Loader2, Wand2, CheckCircle2, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GenerateStatus } from "@/hooks/use-generate";
import { useI18n } from "@/lib/i18n/language-provider";

interface GenerateButtonProps {
  status: GenerateStatus;
  progress: number;
  disabled: boolean;
  onGenerate: () => void;
  onCancel: () => void;
}

/**
 * Generate action with a "render" progress readout.
 *
 * Progress is expressed in frame/timecode language rather than a bare
 * percentage, and the bar uses the warm amber accent — a restrained,
 * filmic signal instead of a generic loading bar.
 */
export function GenerateButton({
  status,
  progress,
  disabled,
  onGenerate,
  onCancel,
}: GenerateButtonProps) {
  const { t } = useI18n();
  const isGenerating = status === "generating";

  const frame = Math.floor((progress / 100) * 30);

  return (
    <div className="space-y-3">
      {isGenerating ? (
        <button
          type="button"
          onClick={onCancel}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border bg-background/40 py-4 text-base font-semibold text-foreground transition-all duration-200 hover:border-destructive/50 hover:text-destructive"
        >
          <X className="h-5 w-5" />
          {t.generate.cancel}
        </button>
      ) : (
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-sm py-4 text-base font-semibold transition-all duration-200",
            disabled
              ? "cursor-not-allowed border border-border bg-transparent text-muted-foreground/60"
              : "bg-brand-gradient cursor-pointer text-primary-foreground hover:opacity-90 active:scale-[0.99]"
          )}
        >
          {status === "completed" ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              {t.generate.regenerate}
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 text-accent-warm" />
              {t.generate.generateVideo}
            </>
          )}
        </button>
      )}

      {isGenerating && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="timecode uppercase tracking-[0.12em] text-muted-foreground">
              {t.generate.generating}
            </span>
            <span className="timecode tabular-nums text-accent-warm">
              FRAME {String(frame).padStart(2, "0")} · {progress}%
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-none bg-muted">
            <div
              className="h-full bg-accent-warm transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          {t.generate.failed}
        </div>
      )}
    </div>
  );
}
