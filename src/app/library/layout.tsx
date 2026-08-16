import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Video Library",
  description:
    "Browse, preview and manage all your AI-generated videos in one place. VibeVideo's library keeps every creation organized.",
  path: "/library/",
  ogDescription:
    "Browse and manage all your AI-generated videos with VibeVideo.",
});

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Public page: the library is browsable without signing in.
  return <>{children}</>;
}
