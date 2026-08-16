import { en, type Translation } from "./en";
import { zh } from "./zh";

export type Locale = "en" | "zh";

export const locales: Locale[] = ["en", "zh"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

export const messages: Record<Locale, Translation> = {
  en,
  zh,
};

export const DEFAULT_LOCALE: Locale = "en";

export type { Translation } from "./en";
