"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/language-provider";
import { PLANS, type BillingPeriod, type PlanId } from "@/lib/plans";
import { usePlan } from "@/lib/plan/plan-provider";
import { PricingCard } from "@/components/pricing/pricing-card";

const FAQ_KEYS = [
  { q: "faq1", a: "faq1a" },
  { q: "faq2", a: "faq2a" },
  { q: "faq3", a: "faq3a" },
  { q: "faq4", a: "faq4a" },
] as const;

export default function PricingPage() {
  const { t } = useI18n();
  const { plan: currentPlan, setPlan } = usePlan();
  const [period, setPeriod] = React.useState<BillingPeriod>("monthly");
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [toast, setToast] = React.useState<string | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleSelect = (planId: PlanId) => {
    // Placeholder purchase flow — connect to a real checkout later.
    // Persist the selection globally so the generate studio's duration
    // limit stays in sync with the chosen plan.
    setPlan(planId);
    setToast(t.pricing.selected);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="relative">
      <div className="container relative py-16 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="timecode text-xs font-medium uppercase tracking-[0.2em] text-accent-warm">
            {t.pricing.subtitle}
          </p>
          <h1 className="title-display mt-3 text-4xl text-foreground md:text-6xl">
            {t.pricing.title}
          </h1>
        </div>

        {/* Billing period toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setPeriod("monthly")}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors",
                period === "monthly"
                  ? "bg-popover text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.pricing.monthly}
            </button>
            <button
              type="button"
              onClick={() => setPeriod("yearly")}
              className={cn(
                "cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors",
                period === "yearly"
                  ? "bg-popover text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.pricing.yearly}
              <span className="ml-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                {t.pricing.saveYearly}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid items-stretch gap-6 pt-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              period={period}
              isCurrent={currentPlan === plan.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Selection toast */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-emerald-500/30 bg-card px-5 py-3 text-sm font-medium text-foreground shadow-lg md:bottom-8"
          >
            {toast}
          </div>
        )}

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="title-display text-center text-3xl text-foreground md:text-4xl">
            {t.pricing.faqTitle}
          </h2>
          <p className="timecode mt-3 text-center text-xs uppercase tracking-[0.08em] text-muted-foreground">
            {t.pricing.faqSubtitle}
          </p>

          <div className="mt-10 space-y-3">
            {FAQ_KEYS.map((item, i) => {
              const isOpen = openFaq === i;
              const question = t.pricing[item.q as keyof typeof t.pricing] as string;
              const answer = t.pricing[item.a as keyof typeof t.pricing] as string;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-foreground">
                      {question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
