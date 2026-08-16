"use client";

import { Film, Palette, MonitorPlay, Zap } from "lucide-react";

import { useI18n } from "@/lib/i18n/language-provider";

export function Features() {
  const { t } = useI18n();

  const FEATURES = [
    {
      icon: Film,
      number: "01",
      title: t.features.textToVideo,
      description: t.features.textToVideoDesc,
    },
    {
      icon: Palette,
      number: "02",
      title: t.features.fourArtStyles,
      description: t.features.fourArtStylesDesc,
    },
    {
      icon: MonitorPlay,
      number: "03",
      title: t.features.crystalClear,
      description: t.features.crystalClearDesc,
    },
    {
      icon: Zap,
      number: "04",
      title: t.features.lightningFast,
      description: t.features.lightningFastDesc,
    },
  ];

  return (
    <section id="features" className="border-b border-border py-12 md:py-24">
      <div className="container grid gap-8 md:gap-12 lg:grid-cols-[1fr_1.4fr]">
        {/* Left — sticky intro (asymmetric, not centered) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="timecode text-xs font-medium uppercase tracking-[0.2em] text-accent-warm">
            {t.features.subtitle}
          </p>
          <h2 className="title-display mt-4 text-4xl text-foreground md:text-5xl">
            {t.features.titlePrefix}{" "}
            <span className="text-accent-warm">{t.features.titleHighlight}</span>
          </h2>
        </div>

        {/* Right — asymmetric feature ledger */}
        <div>
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-border py-7 last:border-b sm:grid-cols-[64px_auto_1fr] sm:items-start"
              >
                <span className="timecode text-sm text-muted-foreground">
                  {feature.number}
                </span>
                <Icon className="h-5 w-5 text-accent-warm transition-transform duration-200 group-hover:-translate-y-0.5" />
                <div className="col-span-2 mt-3 sm:col-span-1 sm:mt-0">
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
