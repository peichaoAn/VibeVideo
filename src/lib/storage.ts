/**
 * Shared browser-storage helpers.
 *
 * Encapsulates the `typeof window` guard + try/catch used throughout the
 * providers so localStorage/cookie reads and writes are consistent and safe
 * (e.g. private-mode Safari throws on write; storage can be unavailable).
 */

/** Safely read a raw string from localStorage. Returns null when unavailable. */
export function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safely write a string to localStorage. Silently ignores storage errors. */
export function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (e.g. private mode, quota exceeded)
  }
}

/** Safely remove a key from localStorage. Silently ignores storage errors. */
export function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

/** Set a long-lived cookie (1 year, SameSite=Lax). */
export function setCookie(key: string, value: string): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${key}=${encodeURIComponent(
      value
    )}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // ignore cookie errors
  }
}

/** Clear a cookie by expiring it immediately. */
export function clearCookie(key: string): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${key}=; path=/; max-age=0`;
  } catch {
    // ignore cookie errors
  }
}
