"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Copy, Check, Heart, Sparkles, Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Inspiration } from "@/lib/types";
import { STYLE_I18N_KEYS } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";

interface InspirationCardProps {
  inspiration: Inspiration;
  /** When provided, "Use this prompt" invokes this callback instead of routing to /generate/. */
  onUsePrompt?: (prompt: string) => void;
}

export function InspirationCard({ inspiration, onUsePrompt }: InspirationCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const styleLabel =
    t.styles[STYLE_I18N_KEYS[inspiration.style].label as keyof typeof t.styles];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inspiration.prompt);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — fail silently, no blocking.
    }
  }, [inspiration.prompt]);

  const handleUsePrompt = useCallback(() => {
    if (onUsePrompt) {
      onUsePrompt(inspiration.prompt);
      return;
    }
    // Hand the prompt off via sessionStorage instead of a URL query string.
    // The static-export build is a multi-page app, and `useSearchParams()` on
    // the generate page would suspend the whole subtree (Suspense) on every
    // client navigation, causing a flash and dropping the prompt. sessionStorage
    // sidesteps both problems: no Suspense suspension, and the value survives
    // the full page load that `router.push` triggers.
    try {
      window.sessionStorage.setItem("vibevideo-pending-prompt", inspiration.prompt);
    } catch {
      // storage unavailable — fall through; the input simply stays empty.
    }
    router.push("/generate/");
  }, [inspiration.prompt, onUsePrompt, router]);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40">
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={inspiration.thumbnailUrl}
          alt={inspiration.title}
          width={800}
          height={450}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3">
          <Badge variant="secondary">{styleLabel}</Badge>
        </div>

        <div className="timecode absolute bottom-3 right-3 flex items-center gap-1 rounded-sm bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          <Clock className="h-3 w-3" />
          00:{String(inspiration.duration).padStart(2, "0")}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate font-semibold text-foreground">
          {inspiration.title}
        </h3>

        {/* Author + likes */}
        <div className="timecode mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {inspiration.authorAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inspiration.authorAvatarUrl}
                alt={inspiration.author}
                loading="lazy"
                className="h-5 w-5 rounded-full object-cover"
              />
            )}
            <span className="truncate">
              {t.inspiration.authorBy} {inspiration.author}
            </span>
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Heart className="h-3.5 w-3.5 text-accent-warm" />
            {inspiration.likes}
          </span>
        </div>

        {/* Prompt */}
        <div className="mt-3 flex-1 rounded-lg border border-border bg-muted/40 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Quote className="h-3.5 w-3.5" />
            {t.inspiration.promptLabel}
          </div>
          <p className="line-clamp-4 text-sm leading-relaxed text-foreground">
            {inspiration.prompt}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className={cn(
              "min-w-0 flex-1 whitespace-nowrap gap-1 px-1 py-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-sm",
              copied && "border-emerald-500/40 text-emerald-500"
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            )}
            {copied ? t.inspiration.copied : t.inspiration.copyPrompt}
          </Button>
          <Button
            size="sm"
            onClick={handleUsePrompt}
            className="min-w-0 flex-1 whitespace-nowrap gap-1 px-1 py-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent-warm sm:h-4 sm:w-4" />
            {t.inspiration.usePrompt}
          </Button>
        </div>
      </div>
    </div>
  );
}
