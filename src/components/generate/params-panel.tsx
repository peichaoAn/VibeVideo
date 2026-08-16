"use client";

import { Palette, RectangleHorizontal, Timer } from "lucide-react";

import { cn } from "@/lib/utils";
import { RATIO_OPTIONS, STYLE_OPTIONS, RATIO_I18N_KEYS, STYLE_I18N_KEYS } from "@/lib/types";
import type { GenerateParams, VideoAspectRatio, VideoStyle } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";
import { usePlan } from "@/lib/plan/plan-provider";

interface ParamsPanelProps {
  params: GenerateParams;
  onStyleChange: (style: VideoStyle) => void;
  onRatioChange: (ratio: VideoAspectRatio) => void;
  onDurationChange: (duration: number) => void;
}

function GroupLabel({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline gap-2 lg:mb-3">
      <span className="text-accent-warm">{icon}</span>
      <span className="timecode text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </span>
      {hint && (
        <span className="timecode ml-auto text-xs font-medium text-foreground">
          {hint}
        </span>
      )}
    </div>
  );
}

/**
 * Visual "film-look" swatches for each style. Each swatch is a small
 * abstract colour/texture strip that hints at the aesthetic, replacing the
 * generic text-only chips with a distinctive, non-template preview.
 */
const STYLE_SWATCHES: Record<VideoStyle, string> = {
  cinematic:
    "linear-gradient(135deg, #1a1a22 0%, #3b2f2f 45%, #e8952a 46%, #2a2320 60%, #0b0b0e 100%)",
  anime:
    "linear-gradient(135deg, #f4a7b9 0%, #7cc6e0 40%, #ffe08a 60%, #b892d6 100%)",
  realistic:
    "linear-gradient(135deg, #3a5a40 0%, #8a9a6b 35%, #d6c9a8 60%, #2f3e2f 100%)",
  abstract:
    "linear-gradient(135deg, #e8952a 0%, #d64545 40%, #2a2a32 55%, #7a5cff 100%)",
};

export function ParamsPanel({
  params,
  onStyleChange,
  onRatioChange,
  onDurationChange,
}: ParamsPanelProps) {
  const { t } = useI18n();
  const { maxDuration } = usePlan();

  // Clamp the slider to the current plan's duration ceiling. The minimum is
  // 3s across all plans; the max follows the selected plan (free 15 / pro 30
  // / studio 60).
  const durationMax = maxDuration;

  const styleLabel = (value: VideoStyle) =>
    t.styles[STYLE_I18N_KEYS[value].label as keyof typeof t.styles];
  const styleDesc = (value: VideoStyle) =>
    t.styles[STYLE_I18N_KEYS[value].description as keyof typeof t.styles];

  return (
    <div className="space-y-4 lg:space-y-9">
      {/* Style — film-look filter cards */}
      <section>
        <GroupLabel
          icon={<Palette className="h-3.5 w-3.5" />}
          title={t.generate.artStyle}
        />
        <div className="grid grid-cols-2 gap-2 lg:gap-2.5">
          {STYLE_OPTIONS.map((option) => {
            const active = params.style === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onStyleChange(option.value)}
                aria-pressed={active}
                className={cn(
                  "group relative flex cursor-pointer flex-col gap-2.5 overflow-hidden rounded-sm border p-0 text-left transition-all duration-200",
                  active
                    ? "border-accent-warm bg-accent-soft/40"
                    : "border-border/70 hover:border-border"
                )}
              >
                {/* Film-look swatch */}
                <span
                  className="block h-8 w-full lg:h-12"
                  style={{ background: STYLE_SWATCHES[option.value] }}
                />
                {/* Selected corner marker */}
                <span
                  className={cn(
                    "absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-[2px] border text-[9px] leading-none transition-opacity duration-150",
                    active
                      ? "border-accent-warm bg-accent-warm text-black opacity-100"
                      : "border-white/40 bg-black/40 text-white opacity-0 group-hover:opacity-60"
                  )}
                >
                  ✓
                </span>
                <span className="flex flex-col gap-0.5 px-2.5 pb-2.5 lg:px-3 lg:pb-3">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-accent-warm" : "text-foreground/80"
                    )}
                  >
                    {styleLabel(option.value)}
                  </span>
                  <span className="hidden text-[11px] leading-snug text-muted-foreground lg:block">
                    {styleDesc(option.value)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Aspect ratio — real frame rectangles */}
      <section>
        <GroupLabel
          icon={<RectangleHorizontal className="h-3.5 w-3.5" />}
          title={t.generate.aspectRatio}
        />
        <div className="flex items-end gap-3 lg:gap-4">
          {RATIO_OPTIONS.map((option) => {
            const active = params.aspectRatio === option.value;
            const frame =
              option.value === "16:9"
                ? "h-8 w-14"
                : option.value === "9:16"
                  ? "h-14 w-8"
                  : "h-11 w-11";
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onRatioChange(option.value)}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-[2px] border-[1.5px] transition-all duration-200",
                    frame,
                    active
                      ? "border-accent-warm bg-accent-soft"
                      : "border-muted-foreground/40 hover:border-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "rounded-[1px] border-[1px]",
                      option.value === "16:9"
                        ? "h-2 w-8"
                        : option.value === "9:16"
                          ? "h-8 w-2"
                          : "h-5 w-5",
                      active ? "border-accent-warm/70" : "border-muted-foreground/30"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "timecode text-xs",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t.ratios[RATIO_I18N_KEYS[option.value] as keyof typeof t.ratios]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Duration — timeline slider */}
      <section>
        <GroupLabel
          icon={<Timer className="h-3.5 w-3.5" />}
          title={t.generate.duration}
          hint={`${params.duration}s`}
        />
        <input
          type="range"
          min={3}
          max={durationMax}
          step={1}
          value={Math.min(params.duration, durationMax)}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-none bg-muted accent-accent-warm"
        />
        <div className="mt-1.5 flex justify-between text-xs tabular-nums text-muted-foreground">
          <span>3s</span>
          <span>{durationMax}s</span>
        </div>
      </section>
    </div>
  );
}
