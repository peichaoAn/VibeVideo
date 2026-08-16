"use client";

import { useState } from "react";
import { Clock, Play, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { VideoWork, WorkStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n/language-provider";

interface VideoGridProps {
  works: VideoWork[];
}

export function VideoGrid({ works }: VideoGridProps) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);

  const STATUS_META: Record<WorkStatus, { label: string; variant: "success" | "secondary" | "destructive" }> = {
    completed: { label: t.library.statusCompleted, variant: "success" },
    generating: { label: t.library.statusGenerating, variant: "secondary" },
    failed: { label: t.library.statusFailed, variant: "destructive" },
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {works.map((work) => {
        const meta = STATUS_META[work.status];
        const isActive = activeId === work.id;
        return (
          <VideoCard
            key={work.id}
            work={work}
            meta={meta}
            isActive={isActive}
            onHover={setActiveId}
          />
        );
      })}
    </div>
  );
}

interface VideoCardProps {
  work: VideoWork;
  meta: { label: string; variant: "success" | "secondary" | "destructive" };
  isActive: boolean;
  onHover: (id: string | null) => void;
}

function VideoCard({ work, meta, isActive, onHover }: VideoCardProps) {
  const { t } = useI18n();

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/40"
      onMouseEnter={() => onHover(work.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.thumbnailUrl}
          alt={t.works[work.titleKey as keyof typeof t.works]}
          width={800}
          height={450}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={meta.variant}>
            {work.status === "generating" && (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            )}
            {meta.label}
          </Badge>
        </div>

        {/* Duration — timecode-style readout */}
        <div className="timecode absolute bottom-3 right-3 flex items-center gap-1 rounded-sm bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          <Clock className="h-3 w-3" />
          00:{String(work.duration).padStart(2, "0")}
        </div>

        {/* Hover play overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            isActive ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold text-foreground">
          {t.works[work.titleKey as keyof typeof t.works]}
        </h3>
        <div className="timecode mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">{work.style}</span>
          <span>{work.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
