"use client";

import { useI18n } from "@/lib/i18n/language-provider";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

// Testimonials are intentionally bilingual (mixed EN + ZH) and kept as fixed
// content — they do NOT go through i18n, so switching the UI language leaves
// these real user voices unchanged. This mirrors an international community.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "VibeVideo completely changed how I pitch ideas to clients. I can turn a one-line concept into a cinematic reel before a meeting ends.",
    name: "Sarah Mitchell",
    role: "Creative Director",
    initials: "SM",
  },
  {
    quote:
      "质量真的惊艳到我了，电影感风格完全不输专业工作室，几秒钟就能出片。",
    name: "陈子墨",
    role: "独立导演",
    initials: "陈",
  },
  {
    quote:
      "I run three social channels and this is my secret weapon. Ten seconds to a scroll-stopping clip, every single time.",
    name: "Priya Sharma",
    role: "Content Creator",
    initials: "PS",
  },
  {
    quote:
      "我们把整个剪辑流程都换成了 VibeVideo，营销团队用一半的精力上线了更多 campaign。",
    name: "王浩然",
    role: "市场总监",
    initials: "王",
  },
  {
    quote:
      "As a solo founder, I don't have time for post-production. VibeVideo gives me studio-grade assets on demand.",
    name: "Elena Rodriguez",
    role: "Startup Founder",
    initials: "ER",
  },
  {
    quote:
      "风格记忆功能是杀手锏，每一次渲染都像为我量身定制 —— 因为它确实如此。",
    name: "林晓雨",
    role: "品牌策略师",
    initials: "林",
  },
];

export function Testimonials() {
  const { t } = useI18n();

  return (
    <section id="testimonials" className="py-12 md:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="timecode text-xs font-medium uppercase tracking-[0.2em] text-accent-warm">
            {t.testimonials.badge}
          </p>
          <h2 className="title-display mt-4 text-4xl text-foreground md:text-5xl">
            {t.testimonials.titlePrefix}{" "}
            <span className="text-accent-warm">
              {t.testimonials.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Magazine-style pull-quotes — editorial serif, asymmetric */}
        <div className="mt-10 grid gap-x-12 gap-y-8 md:mt-16 md:gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="flex flex-col">
              <span
                aria-hidden="true"
                className="title-display text-6xl leading-none text-accent-warm/40"
              >
                &ldquo;
              </span>
              <blockquote className="title-display mt-2 text-xl leading-snug text-foreground">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className="timecode flex h-9 w-9 items-center justify-center rounded-sm bg-muted text-sm font-medium text-foreground">
                  {item.initials}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {item.name}
                  </div>
                  <div className="timecode text-xs text-muted-foreground">
                    {item.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
