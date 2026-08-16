"use client";

import { useRef, useState } from "react";
import {
  MonitorPlay,
  Wand2,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Film,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { GenerateStatus } from "@/hooks/use-generate";
import type { VideoAspectRatio } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";

interface PreviewCanvasProps {
  status: GenerateStatus;
  progress: number;
  aspectRatio: VideoAspectRatio;
  videoUrl: string | null;
  /** Clip duration in seconds (drives the timecode / frame counter readout). */
  duration?: number;
}

/** Frames per second used for the monitor timecode readout. */
const FRAME_RATE = 30;

/**
 * Map a render progress (0–100) to a standard SMPTE-style timecode
 * `HH:MM:SS:FF` over a clip of the given duration, so the readout always
 * reflects real elapsed render time instead of a misleading "00:00:xx:xx".
 */
/** Clamp progress to a valid 0–100 range so frame/timecode math never overflows. */
function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, progress));
}

function formatTimecode(progress: number, durationSeconds: number): string {
  const p = clampProgress(progress);
  const totalFrames = Math.floor((p / 100) * durationSeconds * FRAME_RATE);
  const frames = totalFrames % FRAME_RATE;
  const totalSeconds = Math.floor(totalFrames / FRAME_RATE);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

/** Current frame index (1-based) derived from progress, matching the timecode. */
function currentFrame(progress: number, durationSeconds: number): number {
  const p = clampProgress(progress);
  return Math.min(
    Math.floor((p / 100) * durationSeconds * FRAME_RATE) + 1,
    durationSeconds * FRAME_RATE
  );
}

/**
 * Monitor screen preview.
 *
 * Rendered as a film "monitor": letterbox bars top & bottom, a timecode
 * readout and a status badge — so every state (idle / generating / completed
 * / failed) reads like a live monitor, not a generic AI card.
 */
export function PreviewCanvas({
  status,
  progress,
  aspectRatio,
  videoUrl,
  duration = 5,
}: PreviewCanvasProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const ratioClass =
    aspectRatio === "9:16"
      ? "aspect-[9/16] w-full max-w-[150px] lg:max-w-[260px] lg:sm:max-w-[300px]"
      : aspectRatio === "1:1"
        ? "aspect-square w-full max-w-[180px] lg:max-w-[340px] lg:sm:max-w-[400px]"
        : "aspect-video w-full max-w-full lg:max-w-[560px]";

  const hasVideo = status === "completed" && !!videoUrl;

  // Standard HH:MM:SS:FF timecode reflecting render progress during generation.
  const timecode = formatTimecode(progress, duration);
  const frameIndex = currentFrame(progress, duration);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-md border border-border/40 bg-card">
      {/* Monitor top chrome */}
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-1.5 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          <MonitorPlay className="h-4 w-4 shrink-0 text-accent-warm" />
          <span className="timecode truncate text-xs font-medium uppercase tracking-[0.08em] text-foreground sm:text-sm">
            {t.generate.preview}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="timecode hidden text-xs text-muted-foreground sm:inline">
            {timecode}
          </span>
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "failed"
                  ? "destructive"
                  : status === "generating"
                    ? "default"
                    : "outline"
            }
          >
            {status === "completed"
              ? t.generate.previewDone
              : status === "failed"
                ? t.generate.failed
                : status === "generating"
                  ? t.generate.generating
                  : t.generate.previewIdle}
          </Badge>
        </div>
      </div>

      {/* Monitor body */}
      <div className="flex items-center justify-center bg-background/60 p-2 sm:p-3 lg:p-6 lg:md:p-10">
        {/* Letterbox wrapper */}
        <div className="relative flex w-full flex-col overflow-hidden rounded-sm bg-black">
          {/* Letterbox top bar */}
          <div className="relative z-10 flex h-4 items-center justify-between bg-black px-2 sm:px-3 lg:h-6 lg:md:h-7">
            <span className="timecode truncate text-[10px] text-white/50">
              {t.generate.previewMonitorLabel}
            </span>
            <span className="timecode shrink-0 text-[10px] text-white/50">TC {timecode}</span>
          </div>

          <div
            className={cn(
              "relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden transition-all duration-300 ease-out will-change-[width,height]",
              ratioClass,
              status === "completed" && "ring-1 ring-emerald-500/40"
            )}
          >
            {/* Ambient screen backdrop — deep neutral film bath */}
            {status === "idle" && (
              <div className="preview-atmosphere idle-breathe absolute inset-0" />
            )}
            {status === "generating" && (
              <div className="preview-atmosphere-active idle-breathe absolute inset-0" />
            )}

            {/* Living film grain — a subtle analog shimmer over the bath */}
            {(status === "idle" || status === "generating") && (
              <div className="film-grain-live pointer-events-none z-10" />
            )}

            {/* Developing region — a warm emulsion rises with render progress */}
            {status === "generating" && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-[height] duration-300 ease-out"
                style={{
                  height: `${progress}%`,
                  background:
                    "linear-gradient(180deg, hsl(36 82% 55% / 0.14), hsl(240 20% 22% / 0.55))",
                }}
              />
            )}

            {/* Developer fluid line — restrained warm leading edge */}
            {status === "generating" && (
              <div
                className="pointer-events-none absolute inset-x-0 z-20 transition-[bottom] duration-300 ease-out"
                style={{ bottom: `${progress}%` }}
              >
                <div className="developer-line" />
              </div>
            )}

            {status === "idle" && (
              <div className="relative flex flex-col items-center gap-2 px-4 py-4 text-center sm:gap-3 sm:px-6 sm:py-6 lg:py-16">
                <div className="idle-float relative flex h-12 w-12 items-center justify-center rounded-lg border border-[hsl(36_82%_55%/0.35)] bg-[hsl(36_82%_55%/0.08)] sm:h-14 sm:w-14">
                  <Film className="h-6 w-6 text-[hsl(36_82%_55%)] sm:h-7 sm:w-7" />
                </div>
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {t.generate.previewEmpty}
                </p>
                <p className="max-w-[240px] text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  {t.generate.previewEmptyHint}
                </p>
              </div>
            )}

            {status === "generating" && (
              <div className="relative flex flex-col items-center gap-4 px-4 py-4 text-center sm:gap-5 sm:px-6 sm:py-6 lg:py-16">
                <div className="flex flex-col items-center gap-1">
                  <span className="timecode text-xl font-semibold tabular-nums text-[hsl(36_82%_55%)] sm:text-2xl">
                    {clampProgress(Math.floor(progress))}%
                  </span>
                  <span className="timecode text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                    FRAME {String(frameIndex).padStart(2, "0")} · {t.generate.developing}
                  </span>
                </div>
              </div>
            )}

            {status === "completed" && !hasVideo && (
              <div className="relative flex flex-col items-center gap-2 px-4 py-4 text-center sm:gap-3 sm:px-6 sm:py-6 lg:py-16">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-[hsl(160_84%_39%/0.4)] bg-[hsl(160_84%_39%/0.08)] sm:h-14 sm:w-14">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(160_84%_39%)] sm:h-7 sm:w-7" />
                </div>
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {t.generate.previewDoneHint}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
                  <Wand2 className="h-3.5 w-3.5 shrink-0" />
                  {t.generate.previewRegenerateHint}
                </div>
              </div>
            )}

            {hasVideo && videoUrl && (
              <div
                className="group relative flex h-full w-full cursor-pointer items-center justify-center"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="h-full w-full object-cover"
                  controls={false}
                  playsInline
                  loop
                  muted
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onError={() => setPlaying(false)}
                />
                {/* Film grain over the playback for a tactile film look */}
                <div className="film-grain pointer-events-none absolute inset-0 z-10" />
                <span className="timecode pointer-events-none absolute left-3 top-4 z-20 text-[10px] text-white/70">
                  {timecode}
                </span>
                {!playing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 transition-opacity group-hover:bg-black/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-none bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xs text-white/80">
                      {t.generate.previewTapToPlay}
                    </span>
                  </div>
                )}
                {playing && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-none bg-black/40">
                      <Pause className="h-7 w-7 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {status === "failed" && (
              <div className="relative flex flex-col items-center gap-2 px-4 py-4 text-center sm:gap-3 sm:px-6 sm:py-6 lg:py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-destructive/10 sm:h-14 sm:w-14">
                  <XCircle className="h-6 w-6 text-destructive sm:h-7 sm:w-7" />
                </div>
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {t.generate.previewFailed}
                </p>
              </div>
            )}
          </div>

          {/* Letterbox bottom bar */}
          <div className="relative z-10 flex h-4 items-center justify-between bg-black px-2 sm:px-3 lg:h-6 lg:md:h-7">
            <span className="timecode truncate text-[10px] text-white/50">
              {t.generate.previewRenderLabel.replace("{duration}", String(duration))}
            </span>
            <span className="timecode shrink-0 text-[10px] text-white/50">
              {aspectRatio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
