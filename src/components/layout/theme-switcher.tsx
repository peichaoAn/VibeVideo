"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/layout/theme-provider";
import { useI18n } from "@/lib/i18n/language-provider";

export function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={t.theme.appearance}
      title={t.theme.appearance}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
    >
      {mode === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
