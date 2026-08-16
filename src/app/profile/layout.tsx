import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Profile",
  description:
    "Manage your VibeVideo account, appearance and language preferences.",
  path: "/profile/",
  ogDescription:
    "Manage your account, appearance and language preferences with VibeVideo.",
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
