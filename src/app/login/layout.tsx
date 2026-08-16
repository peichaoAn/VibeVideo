import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Log in",
  description:
    "Log in to VibeVideo to start generating cinematic, studio-quality videos with AI.",
  path: "/login/",
  index: false,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
