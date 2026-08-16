import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Simple, transparent pricing for VibeVideo. Start free and upgrade when you need more — no hidden fees, cancel anytime.",
  path: "/pricing/",
  ogDescription:
    "Choose the plan that fits your AI video creation needs. Free, Pro, and Studio.",
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Public page: pricing is browsable without signing in.
  return <>{children}</>;
}
