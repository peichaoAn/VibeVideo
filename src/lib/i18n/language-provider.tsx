"use client";

import * as React from "react";

import {
  DEFAULT_LOCALE,
  messages,
  type Locale,
  type Translation,
} from "./locales";
import { safeGetItem, safeSetItem, setCookie } from "@/lib/storage";

const STORAGE_KEY = "vibevideo-locale";

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

interface LanguageContextValue {
  locale: Locale;
  t: Translation;
  setLocale: (locale: Locale) => void;
}

/** Safely read a persisted locale, falling back to the default. */
function readStoredLocale(): Locale {
  const raw = safeGetItem(STORAGE_KEY);
  if (raw === "en" || raw === "zh") return raw;
  return DEFAULT_LOCALE;
}

const LanguageContext = React.createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  t: messages[DEFAULT_LOCALE],
  setLocale: () => {},
});

export function LanguageProvider({
  children,
  initialLocale,
}: LanguageProviderProps) {
  // First render uses the default locale (matching the server-rendered HTML);
  // the persisted locale is restored in an effect after hydration to avoid a
  // server/client first-paint mismatch.
  const [locale, setLocaleState] = React.useState<Locale>(
    () => initialLocale ?? DEFAULT_LOCALE
  );

  React.useEffect(() => {
    setLocaleState(initialLocale ?? readStoredLocale());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.setAttribute("data-locale", next);
    safeSetItem(STORAGE_KEY, next);
    // Persist to a cookie as well so it survives across contexts (and is
    // available to any server-side consumers if SSR is later enabled).
    setCookie(STORAGE_KEY, next);
  }, []);

  const value = React.useMemo(
    () => ({ locale, t: messages[locale], setLocale }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useI18n = () => React.useContext(LanguageContext);
