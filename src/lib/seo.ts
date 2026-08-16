import type { Metadata } from "next";

const SITE_NAME = "VibeVideo";

interface SeoOptions {
  /** Page title (already includes any "— VibeVideo" suffix where desired). */
  title: string;
  description: string;
  /** Canonical path, e.g. "/inspiration/". */
  path: string;
  /** Open Graph title. Defaults to `${title} — VibeVideo`. */
  ogTitle?: string;
  /** Open Graph description. Defaults to `description`. */
  ogDescription?: string;
  /** Whether search engines may index this page. */
  index?: boolean;
}

/**
 * Build a consistent `Metadata` object for a route. Centralizes the repeated
 * canonical + openGraph boilerplate used across the page-level layouts.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  index = true,
}: SeoOptions): Metadata {
  const fullOgTitle = ogTitle ?? `${title} — ${SITE_NAME}`;
  const fullOgDescription = ogDescription ?? description;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    ...(index
      ? {
          openGraph: {
            title: fullOgTitle,
            description: fullOgDescription,
          },
        }
      : {
          robots: {
            index: false,
            follow: false,
          },
        }),
  };
}
