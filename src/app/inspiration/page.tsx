"use client";

import { Lightbulb } from "lucide-react";

import { InspirationView } from "@/components/inspiration/inspiration-view";
import { useI18n } from "@/lib/i18n/language-provider";

export default function InspirationPage() {
  const { t } = useI18n();

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="title-display flex items-center gap-3 text-4xl text-foreground md:text-5xl">
          <Lightbulb className="h-8 w-8 text-accent-warm" />
          {t.inspiration.title}
        </h1>
        <p className="timecode mt-3 max-w-2xl text-sm uppercase tracking-[0.08em] text-muted-foreground">
          {t.inspiration.subtitle}
        </p>
      </div>

      <InspirationView />
    </div>
  );
}
