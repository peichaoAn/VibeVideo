"use client";

import * as React from "react";

import {
  safeGetItem,
  safeSetItem,
  safeRemoveItem,
  setCookie,
  clearCookie,
} from "@/lib/storage";

const STORAGE_KEY = "vibevideo-auth";

/** Default test credentials. Used to pre-fill the login form in dev/test. */
export const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "admin_123",
} as const;

export interface AuthUser {
  username: string;
  /** Display name (same as username for the fake auth). */
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** True once the persisted auth state has been restored after hydration. */
  hydrated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  hydrated: false,
  signIn: async () => {},
  signOut: () => {},
});

function readStoredUser(): AuthUser | null {
  const raw = safeGetItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.username === "string") {
      return {
        username: parsed.username,
        name: typeof parsed.name === "string" ? parsed.name : parsed.username,
      };
    }
  } catch {
    // ignore corrupted storage
  }
  return null;
}

/**
 * Restore the persisted user; if none exists, fall back to the default test
 * account so this static/test project is "logged in by default". The fallback
 * user is also persisted (localStorage + cookie) to match `signIn` behavior.
 */
function readOrCreateStoredUser(): AuthUser {
  const stored = readStoredUser();
  if (stored) return stored;

  const defaultUser: AuthUser = {
    username: DEFAULT_CREDENTIALS.username,
    name: DEFAULT_CREDENTIALS.username,
  };
  safeSetItem(STORAGE_KEY, JSON.stringify(defaultUser));
  setCookie(STORAGE_KEY, JSON.stringify(defaultUser));
  return defaultUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start at `null` on the first render (matching the server-rendered HTML) and
  // restore the persisted user in an effect after hydration. Reading
  // `localStorage` during the initial render would make the server and client
  // first paints diverge (SSR renders `null`, client renders the stored user),
  // causing a hydration mismatch. `hydrated` lets consumers avoid a flash.
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // Restore the persisted state (or the default test account) once mounted on
  // the client. This runs after hydration, so it no longer conflicts with the
  // server-rendered HTML.
  React.useEffect(() => {
    setUser(readOrCreateStoredUser());
    setHydrated(true);
  }, []);

  const signIn = React.useCallback(async (username: string, password: string) => {
    // Fake auth: no backend. Just persist the username. Simulate a short
    // delay for natural UX.
    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextUser: AuthUser = { username, name: username };
    setUser(nextUser);
    safeSetItem(STORAGE_KEY, JSON.stringify(nextUser));
    setCookie(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    safeRemoveItem(STORAGE_KEY);
    clearCookie(STORAGE_KEY);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      hydrated,
      signIn,
      signOut,
    }),
    [user, hydrated, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => React.useContext(AuthContext);
