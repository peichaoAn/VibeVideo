"use client";

import { useMemo, useState } from "react";

import { InspirationCard } from "@/components/inspiration/inspiration-card";
import { FilterBar } from "@/components/ui/filter-bar";
import { MOCK_INSPIRATIONS } from "@/lib/inspirations";
import { STYLE_I18N_KEYS, STYLE_OPTIONS, type VideoStyle } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";

type Filter = "all" | VideoStyle;

interface InspirationViewProps {
  /** When provided, "Use this prompt" invokes this callback (used by the in-generator mobile tab). */
  onUsePrompt?: (prompt: string) => void;
}

/**
 * InspirationView — the reusable "filter bar + inspiration grid" view shared
 * by the standalone /inspiration/ page and the in-generator mobile tab.
 */
export function InspirationView({ onUsePrompt }: InspirationViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const { t } = useI18n();

  const FILTERS = [
    { value: "all" as Filter, label: t.inspiration.filterAll },
    ...STYLE_OPTIONS.map((option) => ({
      value: option.value as Filter,
      label: t.styles[STYLE_I18N_KEYS[option.value].label as keyof typeof t.styles],
    })),
  ];

  const inspirations = useMemo(() => {
    if (filter === "all") return MOCK_INSPIRATIONS;
    return MOCK_INSPIRATIONS.filter((item) => item.style === filter);
  }, [filter]);

  return (
    <>
      {/* Filter bar */}
      <div className="mb-8">
        <FilterBar value={filter} options={FILTERS} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {inspirations.map((inspiration) => (
          <InspirationCard
            key={inspiration.id}
            inspiration={inspiration}
            onUsePrompt={onUsePrompt}
          />
        ))}
      </div>
    </>
  );
}
