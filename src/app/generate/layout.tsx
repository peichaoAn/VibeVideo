import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";

export const metadata: Metadata = {
  title: "AI Video Generator",
  description:
    "Describe your scene, pick a style and let VibeVideo's AI generate cinematic video in seconds. Text-to-video with cinematic, anime, realistic and abstract styles.",
  alternates: {
    canonical: "/generate/",
  },
  openGraph: {
    title: "AI Video Generator — VibeVideo",
    description:
      "Turn text prompts into cinematic video with VibeVideo's AI generator.",
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
