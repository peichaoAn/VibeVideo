"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Moon, Sun, ChevronRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme } from "@/components/layout/theme-provider";
import { locales, localeNames } from "@/lib/i18n/locales";

export default function ProfilePage() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const { mode, setMode } = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const THEME_OPTIONS: { value: "light" | "dark"; label: string; icon: typeof Sun }[] = [
    { value: "light", label: t.profile.light, icon: Sun },
    { value: "dark", label: t.profile.dark, icon: Moon },
  ];

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="title-display text-4xl text-foreground md:text-5xl">
            {t.profile.title}
          </h1>
          <p className="timecode mt-3 text-sm uppercase tracking-[0.08em] text-muted-foreground">
            {t.profile.subtitle}
          </p>
        </div>

        {/* Account */}
        <section className="surface mb-6 rounded-lg p-6">
          <h2 className="timecode mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t.profile.account}
          </h2>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                <User className="h-6 w-6 text-accent-warm" />
              </div>
              <p className="truncate font-medium text-foreground">
                {user.name}
                {user.username ? (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    @{user.username}
                  </span>
                ) : null}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {t.profile.notLoggedIn}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.profile.loginHint}
                </p>
              </div>
              <Button asChild size="sm" className="text-primary-foreground hover:opacity-90">
                <Link href="/login/">
                  {t.profile.goLogin}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Appearance */}
        <section className="surface mb-6 rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-foreground">
              {t.profile.appearance}
            </h2>
            <div className="flex rounded-full border border-border bg-muted p-1">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = mode === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="surface mb-6 rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-foreground">
              {t.profile.language}
            </h2>
            <div className="flex rounded-full border border-border bg-muted p-1">
              {locales.map((code) => {
                const active = locale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={cn(
                      "flex cursor-pointer items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {localeNames[code]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* About / Links (mobile only, collapsible menu) */}
        <section className="surface mb-6 overflow-hidden rounded-lg md:hidden">
          <button
            type="button"
            onClick={() => setAboutOpen((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between p-6 text-left"
          >
            <span className="text-sm font-medium text-foreground">
              {t.footer.product} &amp; {t.footer.company}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                aboutOpen && "rotate-180"
              )}
            />
          </button>

          {aboutOpen && (
            <div className="border-t border-border px-6 pb-6 pt-4">
              <h3 className="timecode mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t.footer.product}
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/generate/" className="transition-colors hover:text-foreground">
                    {t.footer.aiGenerator}
                  </Link>
                </li>
                <li>
                  <Link href="/library/" className="transition-colors hover:text-foreground">
                    {t.footer.library}
                  </Link>
                </li>
                <li>
                  <Link href="/inspiration/" className="transition-colors hover:text-foreground">
                    {t.nav.inspiration}
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="transition-colors hover:text-foreground">
                    {t.footer.features}
                  </Link>
                </li>
              </ul>

              <h3 className="timecode mb-3 mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t.footer.company}
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    {t.footer.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    {t.footer.blog}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    {t.footer.contact}
                  </a>
                </li>
              </ul>

              <div className="mt-5 flex gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
                <a href="#" className="transition-colors hover:text-foreground">
                  {t.footer.privacy}
                </a>
                <a href="#" className="transition-colors hover:text-foreground">
                  {t.footer.terms}
                </a>
              </div>

              <p className="timecode mt-4 text-xs tracking-[0.08em] text-muted-foreground">
                {t.footer.copyright}
              </p>
            </div>
          )}
        </section>

        {/* Sign out */}
        {user && (
          <Button
            variant="destructive"
            size="lg"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-5 w-5" />
            {t.profile.signOut}
          </Button>
        )}
      </div>
    </div>
  );
}
