"use client";

import Image from "next/image";

import { useI18n } from "@/lib/i18n/language-provider";
import { Timecode } from "@/components/layout/film-elements";

export function Showcase() {
  const { t } = useI18n();

  const POINTS = [
    {
      title: t.showcase.point1Title,
      description: t.showcase.point1Desc,
    },
    {
      title: t.showcase.point2Title,
      description: t.showcase.point2Desc,
    },
    {
      title: t.showcase.point3Title,
      description: t.showcase.point3Desc,
    },
  ];

  return (
    <section id="showcase" className="border-b border-border py-12 md:py-24">
      <div className="container grid items-center gap-8 md:gap-12 lg:grid-cols-2">
        {/* Left — copy */}
        <div>
          <p className="timecode text-xs font-medium uppercase tracking-[0.2em] text-accent-warm">
            {t.showcase.badge}
          </p>
          <h2 className="title-display mt-4 text-4xl text-foreground md:text-5xl">
            {t.showcase.titlePrefix}{" "}
            <span className="text-accent-warm">{t.showcase.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t.showcase.subtitle}
          </p>

          <div className="mt-8 md:mt-10">
            {POINTS.map((point) => (
              <div
                key={point.title}
                className="border-t border-border py-5 first:border-t-0 first:pt-0"
              >
                <h3 className="font-semibold text-foreground">{point.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — a widescreen "projected" frame */}
        <div>
          <div className="group relative aspect-video w-full overflow-hidden bg-muted">
            <Image
              src="/images/showcase.jpg"
              alt={t.showcase.visualAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            <Timecode
              value="00:00:07:12"
              className="absolute bottom-3 right-3 text-white/80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
