export type VideoAspectRatio = "16:9" | "9:16" | "1:1";
export type VideoStyle = "cinematic" | "anime" | "realistic" | "abstract";
export type WorkStatus = "generating" | "completed" | "failed";

export interface GenerateParams {
  prompt: string;
  style: VideoStyle;
  aspectRatio: VideoAspectRatio;
  duration: number; // seconds
}

export interface VideoWork {
  id: string;
  titleKey: string; // i18n key under "works" namespace
  thumbnailUrl: string;
  videoUrl: string;
  status: WorkStatus;
  duration: number;
  style: VideoStyle;
  createdAt: string;
}

// A community-shared inspiration case (showcased on the inspiration page).
export interface Inspiration {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  prompt: string; // the prompt used to generate this video
  style: VideoStyle;
  author: string;
  authorAvatarUrl?: string;
  likes: number;
  duration: number; // seconds
  createdAt: string;
}

export const STYLE_OPTIONS: { value: VideoStyle; label: string; description: string }[] = [
  { value: "cinematic", label: "Cinematic", description: "Dramatic film-like lighting & composition" },
  { value: "anime", label: "Anime", description: "Vibrant illustrated motion & cel shading" },
  { value: "realistic", label: "Realistic", description: "Photoreal detail and natural physics" },
  { value: "abstract", label: "Abstract", description: "Surreal shapes, color and flow" },
];

export const RATIO_OPTIONS: { value: VideoAspectRatio; label: string }[] = [
  { value: "16:9", label: "16:9 · Widescreen" },
  { value: "9:16", label: "9:16 · Vertical" },
  { value: "1:1", label: "1:1 · Square" },
];

// Style option value -> sub-key under the `styles` i18n namespace.
export const STYLE_I18N_KEYS: Record<VideoStyle, { label: string; description: string }> = {
  cinematic: { label: "cinematic", description: "cinematicDesc" },
  anime: { label: "anime", description: "animeDesc" },
  realistic: { label: "realistic", description: "realisticDesc" },
  abstract: { label: "abstract", description: "abstractDesc" },
};

// Ratio option value -> sub-key under the `ratios` i18n namespace.
export const RATIO_I18N_KEYS: Record<VideoAspectRatio, string> = {
  "16:9": "widescreen",
  "9:16": "vertical",
  "1:1": "square",
};
