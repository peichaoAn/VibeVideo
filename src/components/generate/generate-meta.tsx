"use client";

import { RecBadge, Timecode } from "@/components/layout/film-elements";
import { useI18n } from "@/lib/i18n/language-provider";

interface GenerateMetaProps {
  promptLength: number;
  style: string;
  ratio: string;
  duration: number;
}

/**
 * Film-slate style page header.
 *
 * A non-symmetric "editing bay" header: serif display title on the left,
 * and a monitor-style status readout (REC badge + timecode + shot meta) on
 * the right.
 */
export function GenerateMeta({ promptLength, style, ratio, duration }: GenerateMetaProps) {
  const { t } = useI18n();

  return (
    <header className="relative">
      <div className="flex flex-col gap-3 lg:gap-8 lg:md:flex-row lg:md:items-end lg:md:justify-between">
        {/* Left — serif display title block */}
        <div>
          <p className="timecode text-xs font-medium uppercase tracking-[0.24em] text-accent-warm">
            {t.generate.subtitle}
          </p>
          <h1 className="title-display mt-1 text-2xl leading-[1.05] text-foreground lg:mt-3 lg:text-4xl lg:md:text-6xl">
            {t.generate.title}
          </h1>
        </div>

        {/* Right — monitor status readout, a "film slate" strip */}
        <div className="flex items-center gap-6 self-start lg:md:self-end">
          <div className="flex flex-col items-end gap-1.5">
            <RecBadge className="text-accent-warm" />
            <Timecode value="00:00:00:00" className="text-sm text-muted-foreground" />
          </div>

          {/* Shot metadata — like a clapperboard caption */}
          <div className="flex flex-col gap-1.5 border-l border-border/70 pl-6">
            <MetaRow label={t.generate.artStyle} value={style} />
            <MetaRow label={t.generate.aspectRatio} value={ratio} />
            <MetaRow label={t.generate.duration} value={`${duration}s`} />
          </div>
        </div>
      </div>
    </header>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-end gap-2">
      <span className="timecode text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="timecode text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}
