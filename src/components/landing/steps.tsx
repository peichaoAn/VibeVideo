"use client";

import { useI18n } from "@/lib/i18n/language-provider";

export function Steps() {
  const { t } = useI18n();

  const STEPS = [
    {
      number: "01",
      title: t.steps.step1Title,
      description: t.steps.step1Desc,
    },
    {
      number: "02",
      title: t.steps.step2Title,
      description: t.steps.step2Desc,
    },
    {
      number: "03",
      title: t.steps.step3Title,
      description: t.steps.step3Desc,
    },
  ];

  return (
    <section id="how-it-works" className="border-b border-border py-12 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="timecode text-xs font-medium uppercase tracking-[0.2em] text-accent-warm">
            {t.steps.badge}
          </p>
          <h2 className="title-display mt-4 text-4xl text-foreground md:text-5xl">
            {t.steps.titlePrefix}{" "}
            <span className="text-accent-warm">{t.steps.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.steps.subtitle}
          </p>
        </div>

        {/* Clapperboard-style numbered slate rows */}
        <div className="mt-10 md:mt-16">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-border py-8 last:border-b sm:grid-cols-[80px_1fr_auto] sm:items-baseline"
            >
              {/* Slate number — serif, angled slash separator */}
              <span className="title-display text-4xl text-foreground/90 md:text-5xl">
                {step.number}
                <span className="text-accent-warm">/</span>
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {/* Right rail — a tiny frame marker */}
              <div className="hidden flex-col items-end gap-1 sm:flex">
                <span className="timecode text-xs text-muted-foreground">
                  SC {step.number}
                </span>
                <span className="block h-6 w-px bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
