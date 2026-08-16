"use client";

import { useState } from "react";
import { Sparkles, Lightbulb } from "lucide-react";

import { PromptInput } from "@/components/generate/prompt-input";
import { ParamsPanel } from "@/components/generate/params-panel";
import { GenerateButton } from "@/components/generate/generate-button";
import { PreviewCanvas } from "@/components/generate/preview-canvas";
import { SharePublish } from "@/components/generate/share-publish";
import { GenerateMeta } from "@/components/generate/generate-meta";
import {
  ViewSwitcher,
  type GenerateView,
} from "@/components/generate/view-switcher";
import { InspirationView } from "@/components/inspiration/inspiration-view";
import { useGenerate } from "@/hooks/use-generate";
import { useI18n } from "@/lib/i18n/language-provider";
import { STYLE_I18N_KEYS, RATIO_I18N_KEYS } from "@/lib/types";

function GenerateContent() {
  const { params, state, updateParams, generate, cancel } = useGenerate();
  const { t } = useI18n();
  const [view, setView] = useState<GenerateView>(() => {
    // Read `?view=inspiration` directly from `window.location` instead of
    // `useSearchParams()`. In the static-export (MPA) build, `useSearchParams`
    // suspends the whole subtree on every client navigation, which caused both
    // a flash and a dropped prompt. Reading the query once at mount (without a
    // Suspense boundary) is enough, since each navigation is a full page load.
    if (typeof window !== "undefined") {
      const viewParam = new URLSearchParams(window.location.search).get("view");
      if (viewParam === "inspiration") return "inspiration";
    }
    return "generate";
  });

  const VIEW_OPTIONS = [
    { value: "generate" as const, label: t.nav.generate, icon: Sparkles },
    { value: "inspiration" as const, label: t.nav.inspiration, icon: Lightbulb },
  ];

  // From the merged mobile "Inspiration" tab: use a prompt and switch back to
  // the "Generate" view, filling the input directly (no page navigation).
  const handleUsePrompt = (prompt: string) => {
    updateParams("prompt", prompt.slice(0, 500));
    setView("generate");
    // Scroll back to the top so the prompt input is visible immediately.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const styleLabel =
    t.styles[STYLE_I18N_KEYS[params.style].label as keyof typeof t.styles];
  const ratioLabel =
    t.ratios[RATIO_I18N_KEYS[params.aspectRatio] as keyof typeof t.ratios];

  return (
    <div className="relative min-h-screen">
      <div className="container relative max-w-7xl py-4 lg:py-10 lg:md:py-14">
        {/* Mobile-only view switcher: merge "Generate" and "Inspiration" */}
        <ViewSwitcher
          value={view}
          onChange={setView}
          options={VIEW_OPTIONS}
          className="mt-6 md:hidden"
        />

        {view === "inspiration" ? (
          <div className="mt-6 md:hidden">
            <InspirationView onUsePrompt={handleUsePrompt} />
          </div>
        ) : (
          <div>
            {/*
         * Mobile header — a compact, single-line title. On mobile the heavy
         * film-slate meta (REC / timecode / shot metadata) is overkill, so we
         * keep it desktop-only and show a lightweight heading instead.
         */}
            <div className="mt-6 md:hidden">
              <h1 className="title-display text-2xl leading-tight text-foreground">
                {t.generate.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.generate.subtitle}
              </p>
            </div>

            {/* Film-slate header (desktop only) */}
            <div className="hidden md:block">
              <GenerateMeta
                promptLength={params.prompt.length}
                style={styleLabel}
                ratio={ratioLabel}
                duration={params.duration}
              />
            </div>

            {/*
         * Workbench — asymmetric editing-bay structure.
         *
         * Desktop: the monitor (preview) is the visual hero, sitting left &
         * tall; the control column sits right. Mobile: input-first — prompt,
         * params and action lead the screen, the preview drops to the bottom
         * as a result panel (matches Pika / Runway / Leonardo mobile UX).
         */}
        <div className="mt-5 grid gap-5 lg:mt-10 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
          {/* Monitor column — on mobile it drops below the controls via order. */}
          <div className="order-2 lg:order-1 lg:sticky lg:top-24">
            <PreviewCanvas
              status={state.status}
              progress={state.progress}
              aspectRatio={params.aspectRatio}
              videoUrl={state.videoUrl}
              duration={params.duration}
            />
          </div>

          {/* Control column — on mobile it leads the screen (order-1). */}
          <div className="order-1 space-y-4 lg:order-2 lg:space-y-8">
            <PromptInput
              value={params.prompt}
              onChange={(value) => updateParams("prompt", value)}
            />

            <div className="border-t border-border/60 pt-4 lg:pt-8">
              <ParamsPanel
                params={params}
                onStyleChange={(style) => updateParams("style", style)}
                onRatioChange={(ratio) => updateParams("aspectRatio", ratio)}
                onDurationChange={(duration) => updateParams("duration", duration)}
              />
            </div>

            <GenerateButton
              status={state.status}
              progress={state.progress}
              disabled={!params.prompt.trim()}
              onGenerate={generate}
              onCancel={cancel}
            />

            <SharePublish status={state.status} />
          </div>
        </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  // No Suspense boundary here: `GenerateContent` no longer calls
  // `useSearchParams()`, so it can render synchronously with no flash.
  return <GenerateContent />;
}
