export type BillingPeriod = "monthly" | "yearly";

export type PlanId = "free" | "pro" | "studio";

export interface PlanFeature {
  /** i18n key under the `pricing.features` namespace. */
  key: string;
}

export interface Plan {
  id: PlanId;
  nameKey: string; // i18n key under `pricing.plans`
  taglineKey: string;
  monthlyPrice: number; // in USD, 0 = free
  yearlyPrice: number; // in USD, 0 = free
  highlighted: boolean;
  badgeKey?: string; // optional "Most popular" style badge
  ctaKey: string;
  /** Maximum video duration (in seconds) this plan supports generating. */
  maxDuration: number;
  features: PlanFeature[];
}

export const PLANS: Plan[] = [
  {
    id: "free",
    nameKey: "free",
    taglineKey: "freeTagline",
    monthlyPrice: 0,
    yearlyPrice: 0,
    highlighted: false,
    ctaKey: "ctaFree",
    maxDuration: 15,
    features: [
      { key: "freeVideos" },
      { key: "durationFree" },
      { key: "watermark" },
      { key: "stdRes" },
      { key: "community" },
    ],
  },
  {
    id: "pro",
    nameKey: "pro",
    taglineKey: "proTagline",
    monthlyPrice: 19,
    yearlyPrice: 182,
    highlighted: true,
    badgeKey: "popular",
    ctaKey: "ctaPro",
    maxDuration: 30,
    features: [
      { key: "proVideos" },
      { key: "durationPro" },
      { key: "noWatermark" },
      { key: "hdRes" },
      { key: "allStyles" },
      { key: "priority" },
    ],
  },
  {
    id: "studio",
    nameKey: "studio",
    taglineKey: "studioTagline",
    monthlyPrice: 49,
    yearlyPrice: 470,
    highlighted: false,
    ctaKey: "ctaStudio",
    maxDuration: 60,
    features: [
      { key: "unlimitedVideos" },
      { key: "durationStudio" },
      { key: "ultraRes" },
      { key: "commercial" },
      { key: "apiAccess" },
      { key: "dedicated" },
    ],
  },
];

export const YEARLY_DISCOUNT_LABEL_KEY = "saveYearly";

/** Look up a plan by id. */
export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** Maximum video duration (seconds) supported by a given plan. */
export function getMaxDuration(id: PlanId): number {
  return getPlan(id).maxDuration;
}
