"use client";

import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/language-provider";
import { locales, localeNames } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
      <Globe className="ml-1.5 h-4 w-4 text-muted-foreground" />
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === code
              ? "bg-popover text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {localeNames[code]}
        </button>
      ))}
    </div>
  );
}
