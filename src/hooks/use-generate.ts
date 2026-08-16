"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GenerateParams } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";
import { usePlan } from "@/lib/plan/plan-provider";

export type GenerateStatus = "idle" | "generating" | "completed" | "failed";

interface GenerateState {
  status: GenerateStatus;
  progress: number;
  error: string | null;
  /** Local path / URL of the generated video, ready for the <video> preview. */
  videoUrl: string | null;
}

/**
 * Resolve a playable video URL for the preview.
 *
 * Uses the local `healing.mp4` sample video (served as a static asset from
 * the `public/` directory). This plays reliably from both a plain browser and
 * Electron, since `/videos/healing.mp4` resolves to a normal `http(s)://` URL
 * in either environment.
 */
function resolveVideoUrl(): string {
  // The local sample video placed in `public/`, served by Next.js at `/`.
  return "/videos/healing.mp4";
}

const DEFAULT_PARAMS: GenerateParams = {
  prompt: "",
  style: "cinematic",
  aspectRatio: "16:9",
  duration: 5,
};

/**
 * Read (and clear) a prompt handed off via sessionStorage by the inspiration
 * page's "Use this prompt" button. Returns "" when none was set.
 *
 * This replaces URL query-string passing (`?prompt=...`), which forced the
 * generate page to call `useSearchParams()` and thereby suspend its whole
 * Suspense subtree on every client navigation — the source of both the flash
 * and the dropped prompt in the static-export (MPA) build.
 */
function consumePendingPrompt(): string {
  if (typeof window === "undefined") return "";
  try {
    const prompt = window.sessionStorage.getItem("vibevideo-pending-prompt") ?? "";
    if (prompt) {
      window.sessionStorage.removeItem("vibevideo-pending-prompt");
    }
    return prompt;
  } catch {
    return "";
  }
}

export function useGenerate() {
  const { t } = useI18n();
  const { maxDuration } = usePlan();
  const [params, setParams] = useState<GenerateParams>(() => {
    // Synchronously seed the prompt from sessionStorage on the very first
    // render, so the input is populated immediately with no Suspense race.
    const prompt = consumePendingPrompt();
    return prompt
      ? { ...DEFAULT_PARAMS, prompt: prompt.slice(0, 500) }
      : DEFAULT_PARAMS;
  });
  const [state, setState] = useState<GenerateState>({
    status: "idle",
    progress: 0,
    error: null,
    videoUrl: null,
  });
  // Hold the active interval handle so it can be cancelled / cleaned up.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track the latest status synchronously to guard against duplicate starts.
  const statusRef = useRef<GenerateStatus>("idle");
  statusRef.current = state.status;

  // Keep the duration within the current plan's ceiling. When a lower plan is
  // selected (e.g. studio 60s -> free 15s), clamp any in-flight duration so the
  // generation always respects the plan limit.
  useEffect(() => {
    setParams((prev) => {
      if (prev.duration > maxDuration) {
        return { ...prev, duration: maxDuration };
      }
      return prev;
    });
  }, [maxDuration]);

  const updateParams = useCallback(
    <K extends keyof GenerateParams>(key: K, value: GenerateParams[K]) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Stop any in-flight generation and clear its timer.
  const clearIntervalIfAny = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const generate = useCallback(() => {
    if (statusRef.current === "generating") return;

    if (!params.prompt.trim()) {
      setState({
        status: "failed",
        progress: 0,
        error: t.generate.errorEmpty,
        videoUrl: null,
      });
      return;
    }

    clearIntervalIfAny();
    setState({ status: "generating", progress: 0, error: null, videoUrl: null });

    // TODO: Replace with real AI video generation API call.
    // This is a placeholder that simulates generation progress.
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress >= 100) {
        progress = 100;
        clearIntervalIfAny();
        // Resolve a playable video for the preview (local download when in
        // Electron, otherwise a public sample video URL).
        const videoUrl = resolveVideoUrl();
        setState({ status: "completed", progress: 100, error: null, videoUrl });
      } else {
        setState({
          status: "generating",
          progress: Math.floor(progress),
          error: null,
          videoUrl: null,
        });
      }
    }, 300);
    intervalRef.current = interval;
  }, [params, t, clearIntervalIfAny]);

  // Cancel an in-flight generation and return to the idle state.
  const cancel = useCallback(() => {
    clearIntervalIfAny();
    setState({ status: "idle", progress: 0, error: null, videoUrl: null });
  }, [clearIntervalIfAny]);

  const reset = useCallback(() => {
    clearIntervalIfAny();
    setState({ status: "idle", progress: 0, error: null, videoUrl: null });
  }, [clearIntervalIfAny]);

  // Clean up the timer on unmount to avoid leaks.
  useEffect(() => clearIntervalIfAny, [clearIntervalIfAny]);

  return { params, state, updateParams, generate, cancel, reset };
}
