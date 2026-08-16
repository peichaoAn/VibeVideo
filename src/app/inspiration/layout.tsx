import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Inspiration",
  description:
    "Explore stunning videos shared by top creators. Every piece includes the prompt behind it, so you can learn, remix and start creating.",
  path: "/inspiration/",
  ogDescription:
    "Browse community-shared AI video showcases with their prompts on VibeVideo.",
});

export default function InspirationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Public page: inspiration is browsable without signing in.
  return <>{children}</>;
}
