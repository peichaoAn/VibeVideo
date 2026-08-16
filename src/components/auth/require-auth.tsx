"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-provider";

/**
 * Route guard. Renders children only when the user is authenticated;
 * otherwise redirects to /login (preserving the intended destination so the
 * user is sent back after signing in).
 *
 * Behavior:
 * - During hydration (`!hydrated`): render a neutral loading state so the
 *   client matches the server HTML (no hydration mismatch).
 * - After hydration: if unauthenticated, redirect immediately via
 *   `useLayoutEffect` (runs before paint) and render `null` — no flicker of a
 *   loading spinner before jumping to /login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  // Sync redirect before paint for the already-hydrated, unauthenticated case.
  // useLayoutEffect fires before the browser paints, avoiding any flash.
  React.useLayoutEffect(() => {
    if (hydrated && !isAuthenticated) {
      const destination = window.location.pathname + window.location.search;
      router.replace(`/login/?redirect=${encodeURIComponent(destination)}`);
    }
  }, [isAuthenticated, hydrated, router]);

  // Hydrating: render loading to match SSR.
  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Hydrated + unauthenticated: render nothing; the redirect above handles it.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
