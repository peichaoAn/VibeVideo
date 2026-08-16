"use client";

import * as React from "react";

import { getMaxDuration, type PlanId } from "@/lib/plans";
import { safeGetItem, safeSetItem, setCookie } from "@/lib/storage";

const STORAGE_KEY = "vibevideo-plan";

const DEFAULT_PLAN: PlanId = "pro";

interface PlanContextValue {
  plan: PlanId;
  /** Maximum video duration (seconds) the current plan supports. */
  maxDuration: number;
  /** Whether the persisted plan has been restored after hydration. */
  hydrated: boolean;
  setPlan: (plan: PlanId) => void;
}

const PlanContext = React.createContext<PlanContextValue>({
  plan: DEFAULT_PLAN,
  maxDuration: getMaxDuration(DEFAULT_PLAN),
  hydrated: false,
  setPlan: () => {},
});

function readStoredPlan(): PlanId {
  const raw = safeGetItem(STORAGE_KEY);
  if (raw === "free" || raw === "pro" || raw === "studio") return raw;
  return DEFAULT_PLAN;
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  // First render uses the default so hydration matches SSR exactly; the
  // persisted plan is restored in an effect right after mount.
  const [plan, setPlanState] = React.useState<PlanId>(DEFAULT_PLAN);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setPlanState(readStoredPlan());
    setHydrated(true);
  }, []);

  const setPlan = React.useCallback((next: PlanId) => {
    setPlanState(next);
    safeSetItem(STORAGE_KEY, next);
    setCookie(STORAGE_KEY, next);
  }, []);

  const value = React.useMemo(
    () => ({ plan, maxDuration: getMaxDuration(plan), hydrated, setPlan }),
    [plan, hydrated, setPlan]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export const usePlan = () => React.useContext(PlanContext);
