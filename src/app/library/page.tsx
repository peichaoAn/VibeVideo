"use client";

import { useMemo, useState } from "react";

import { VideoGrid } from "@/components/library/video-grid";
import { FilterBar } from "@/components/ui/filter-bar";
import { MOCK_WORKS } from "@/lib/works";
import type { WorkStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";

type Filter = "all" | WorkStatus;

export default function LibraryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { t } = useI18n();

  const FILTERS = [
    { value: "all" as Filter, label: t.library.filterAll },
    { value: "completed" as Filter, label: t.library.filterCompleted },
    { value: "generating" as Filter, label: t.library.filterGenerating },
  ];

  const works = useMemo(() => {
    if (filter === "all") return MOCK_WORKS;
    return MOCK_WORKS.filter((w) => w.status === filter);
  }, [filter]);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="title-display text-4xl text-foreground md:text-5xl">
          {t.library.title}
        </h1>
        <p className="timecode mt-3 text-sm uppercase tracking-[0.08em] text-muted-foreground">
          {t.library.subtitle}
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8">
        <FilterBar value={filter} options={FILTERS} onChange={setFilter} />
      </div>

      {works.length > 0 ? (
        <VideoGrid works={works} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
          <p className="text-lg text-muted-foreground">{t.library.emptyTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.library.emptySubtitle}
          </p>
        </div>
      )}
    </div>
  );
}
