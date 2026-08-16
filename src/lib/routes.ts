/**
 * Route constants shared across the app.
 */

/** Routes that require authentication (guarded by RequireAuth). */
export const PROTECTED_ROUTES = ["/generate/"];

/** Whether the given href points to a route that requires authentication. */
export function isProtectedRoute(href: string): boolean {
  return PROTECTED_ROUTES.includes(href);
}
