"use client";

import { Lightbulb } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/language-provider";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Film-slate prompt input.
 *
 * Presented as a "script / clapperboard" panel: monospace label, tabular
 * character counter, sharp corners, and restrained example chips.
 */
export function PromptInput({ value, onChange }: PromptInputProps) {
  const { t } = useI18n();
  const EXAMPLES = t.generate.examples;

  return (
    <section className="space-y-2.5 lg:space-y-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor="prompt"
          className="timecode text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          <span className="rec-dot mr-2 inline-block align-middle" />
          {t.generate.describeVideo}
        </label>
        <span
          className={`timecode text-xs ${value.length > 500 ? "text-destructive" : "text-muted-foreground"}`}
        >
          {value.length} / 500
        </span>
      </div>

      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 500))}
        placeholder={t.generate.placeholder}
        className="min-h-[96px] resize-none rounded-sm border-border/70 bg-muted/40 text-base leading-relaxed placeholder:text-muted-foreground focus-visible:bg-muted/60 focus-visible:ring-1 focus-visible:ring-accent-warm/40 lg:min-h-[160px] lg:text-lg"
      />

      <div className="space-y-2.5">
        <div className="timecode flex items-center gap-1.5 text-xs uppercase tracking-[0.08em] text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-accent-warm" />
          {t.generate.tryExample}
        </div>
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onChange(example)}
              className="cursor-pointer rounded-sm border border-border/50 bg-transparent px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent-warm/50 hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
