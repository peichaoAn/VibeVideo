"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark";

const MODE_KEY = "vibevideo-mode";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  mode: "dark",
  setMode: () => {},
  toggleMode: () => {},
});

function readMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = window.localStorage.getItem(MODE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    // ignore storage errors
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // First render uses the default "dark" (matching the server-rendered HTML);
  // the persisted mode is restored in an effect after hydration to avoid a
  // server/client first-paint mismatch.
  const [mode, setModeState] = React.useState<ThemeMode>("dark");

  React.useEffect(() => {
    setModeState(readMode());
  }, []);

  // Apply mode to the root element.
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");

    // The pre-hydration inline script paints an early background color (as an
    // inline style) to prevent a white/dark flash. Clear those inline styles
    // once React is in control so the semantic CSS tokens (`.dark` / `:root`)
    // drive the background and theme switching actually takes effect.
    root.style.backgroundColor = "";
    if (document.body) document.body.style.backgroundColor = "";
  }, [mode]);

  const setMode = React.useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const toggleMode = React.useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Persist the mode on every change (covers both setMode and toggleMode,
  // including functional updates).
  React.useEffect(() => {
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  const value = React.useMemo(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => React.useContext(ThemeContext);
