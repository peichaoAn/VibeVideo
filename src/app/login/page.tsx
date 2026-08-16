"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, ArrowLeft, LogIn, User, Eye, EyeOff } from "lucide-react";

import { useI18n } from "@/lib/i18n/language-provider";
import { useAuth, DEFAULT_CREDENTIALS } from "@/lib/auth/auth-provider";
import { validateLogin } from "@/lib/auth/validation";
import type { LoginErrors } from "@/lib/auth/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

function LoginForm() {
  const { t } = useI18n();
  const { signIn, isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill with default test credentials for the dev/test phase.
  const [username, setUsername] = React.useState<string>(
    DEFAULT_CREDENTIALS.username
  );
  const [password, setPassword] = React.useState<string>(
    DEFAULT_CREDENTIALS.password
  );
  const [errors, setErrors] = React.useState<LoginErrors>({
    username: null,
    password: null,
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // If already authenticated (default silent login in this static/test project),
  // bounce away from the login page before paint to avoid a form flash.
  React.useLayoutEffect(() => {
    if (hydrated && isAuthenticated) {
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") ? redirect : "/";
      router.replace(target);
    }
  }, [hydrated, isAuthenticated, router, searchParams]);

  // Hydrating or redirecting: render a neutral loading state to match SSR.
  if (!hydrated || isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const nextErrors = validateLogin(
      { username, password },
      {
        usernameRequired: t.auth.errorUsernameRequired,
        passwordRequired: t.auth.errorPasswordRequired,
      }
    );
    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) return;

    setSubmitting(true);
    try {
      await signIn(username.trim(), password);
      const redirect = searchParams.get("redirect");
      const target = redirect && redirect.startsWith("/") ? redirect : "/";
      router.replace(target);
    } catch {
      setGeneralError(t.auth.errorLogin);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="container relative flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="surface rounded-lg p-8">
            <div className="mb-8 text-center">
              <Logo className="mx-auto mb-4 h-12 w-12 rounded-xl" iconClassName="h-6 w-6" />
              <h1 className="title-display text-3xl text-foreground">
                {t.auth.title}
              </h1>
              <p className="timecode mt-2 text-sm uppercase tracking-[0.08em] text-muted-foreground">
                {t.auth.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  {t.auth.username}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.auth.usernamePlaceholder}
                    aria-invalid={!!errors.username}
                    className="bg-background/50 pl-9"
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  {t.auth.password}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.auth.passwordPlaceholder}
                    aria-invalid={!!errors.password}
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? t.auth.hidePassword : t.auth.showPassword
                    }
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {generalError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {generalError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="bg-brand-gradient w-full text-primary-foreground hover:opacity-90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t.auth.submitting}
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t.auth.submit}
                  </>
                )}
              </Button>
            </form>

            <p className="timecode mt-6 text-center text-xs text-muted-foreground">
              {t.auth.signUpHint}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.auth.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
