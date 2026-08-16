"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/language-provider";
import type { Plan, BillingPeriod } from "@/lib/plans";

interface PricingCardProps {
  plan: Plan;
  period: BillingPeriod;
  isCurrent?: boolean;
  onSelect: (planId: Plan["id"]) => void;
}

export function PricingCard({
  plan,
  period,
  isCurrent,
  onSelect,
}: PricingCardProps) {
  const { t } = useI18n();
  const price =
    period === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const perLabel = period === "monthly" ? t.pricing.perMonth : t.pricing.perYear;

  const name = t.pricing.plans[plan.nameKey as keyof typeof t.pricing.plans];
  const tagline =
    t.pricing.plans[plan.taglineKey as keyof typeof t.pricing.plans];
  const ctaLabel = t.pricing[plan.ctaKey as keyof typeof t.pricing] as string;

  return (
    <div
      className={cn(
        "relative flex flex-col transition-all duration-300",
        isCurrent && "lg:-translate-y-2"
      )}
    >
      <div
        className={cn(
          "relative flex flex-1 flex-col overflow-hidden rounded-lg border p-6 md:p-8",
          plan.highlighted
            ? "border-accent-warm/60 bg-card shadow-lg shadow-accent-warm/10"
            : "border-border bg-card hover:border-primary/30",
          isCurrent &&
            "ring-2 ring-accent-warm border-accent-warm/80 shadow-xl shadow-accent-warm/20"
        )}
      >
        {/* Film-grain texture for the highlighted hero card. */}
        {plan.highlighted && (
          <div
            aria-hidden
            className="film-grain pointer-events-none absolute inset-0"
          />
        )}

        <div className="relative mb-6 pt-3">
        <h3 className="title-display text-xl text-foreground">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
      </div>

      <div className="relative flex items-baseline gap-1">
        <span className="timecode text-4xl font-bold text-foreground">
          {price === 0 ? "$0" : `$${price}`}
        </span>
        <span className="text-sm text-muted-foreground">{perLabel}</span>
      </div>
      <p className="timecode relative mb-6 mt-2 text-xs text-muted-foreground">
        {price === 0
          ? t.pricing.ctaFree
          : period === "monthly"
            ? t.pricing.billedMonthly
            : t.pricing.billedYearly}
      </p>

      <ul className="relative mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-warm" />
            <span className="text-muted-foreground">
              {t.pricing.features[feature.key as keyof typeof t.pricing.features]}
            </span>
          </li>
        ))}
      </ul>

        <Button
          size="lg"
          variant="outline"
          className={cn(
            "relative w-full",
            isCurrent &&
              "border-accent-warm bg-accent-soft text-accent-warm opacity-100"
          )}
          disabled={isCurrent}
          onClick={() => onSelect(plan.id)}
        >
          {isCurrent ? t.pricing.currentPlan : ctaLabel}
        </Button>
      </div>

      {isCurrent && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge className="bg-brand-gradient gap-1 border-none text-primary-foreground">
            <Sparkles className="h-3 w-3 text-accent-warm" />
            {t.pricing.currentPlan}
          </Badge>
        </div>
      )}
    </div>
  );
}
