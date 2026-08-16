"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { Timecode, RecBadge } from "@/components/layout/film-elements";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="container relative flex flex-col items-center py-10 text-center md:py-24">
        {/* Kick-line — styled like a slate mark, not a generic badge */}
        <div className="flex items-center gap-3">
          <RecBadge />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t.hero.badge}
          </span>
        </div>

        {/* Poster heading — serif display with amber highlight */}
        <h1 className="title-display mt-8 max-w-4xl text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
          {t.hero.titlePrefix}{" "}
          <span className="text-accent-warm">{t.hero.titleHighlight}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="default">
            <Link href="/generate/">
              {t.hero.startGenerating}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/library/">
              <Play className="h-4 w-4" />
              {t.hero.browseGallery}
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {t.hero.noCard} · {t.hero.freeForever}
        </p>

        {/* Product preview — a cinematic film still inside a masked screen */}
        <div className="relative mt-10 w-full max-w-4xl md:mt-16">
          <div className="group relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src="/images/hero-preview.jpg"
              alt={t.hero.previewAlt}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Timecode watermark */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Timecode value="00:00:00:00" className="text-white/70" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                <Play className="ml-0.5 h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip — timecode-style tabular numerals */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 md:mt-16">
          {[
            ["4K", t.hero.stat4k],
            ["10s", t.hero.stat10s],
            ["4", t.hero.stat4],
            ["∞", t.hero.statInf],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="timecode text-2xl font-semibold text-foreground">
                {value}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Social proof — rating badge + customer logo wall */}
        <div className="mt-10 flex flex-col items-center gap-6 md:mt-14">
          {/* Rating badge — stars + score, mirrors the JSON-LD aggregate rating */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <div className="flex items-center gap-0.5" aria-label={`${t.hero.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-accent-warm text-accent-warm"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="timecode text-sm font-semibold text-foreground">
              {t.hero.rating}
            </span>
            <span className="text-sm text-muted-foreground">
              {t.hero.reviewCount}
            </span>
          </div>

          {/* Logo wall — recognizable brand names as a trust signal */}
          <div className="flex flex-col items-center gap-3">
            <span className="timecode text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t.hero.logosLabel}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {["NOVA", "LUMEN", "ATLAS", "VERTEX", "ORBIT", "HELIOS"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="timecode text-sm font-semibold tracking-[0.2em] text-muted-foreground/70"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Trust line — styled as a rolling subtitle */}
          <p className="timecode text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t.hero.trustedBy}
          </p>
        </div>
      </div>
    </section>
  );
}
