"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, LogIn, LogOut, User, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { useI18n } from "@/lib/i18n/language-provider";
import { useAuth } from "@/lib/auth/auth-provider";
import { isProtectedRoute } from "@/lib/routes";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useI18n();
  const { user, signOut } = useAuth();

  // "创作灵感" is a merged tab inside the generate page on mobile, but a
  // standalone page on desktop. Each entry carries an optional `mobileHref`.
  const NAV_LINKS = [
    { href: "/", label: t.nav.home },
    { href: "/generate/", label: t.nav.generate },
    { href: "/library/", label: t.nav.library },
    {
      href: "/inspiration/",
      mobileHref: "/generate/?view=inspiration",
      label: t.nav.inspiration,
    },
    { href: "/pricing/", label: t.nav.pricing },
  ];

  const handleSignOut = () => {
    signOut();
    router.push("/");
    setMenuOpen(false);
  };

  // When already on the login page and still unauthenticated, clicking a
  // protected route would navigate there and immediately bounce back to
  // /login (flash). Block the navigation in that case — only Home should
  // navigate. The login button handles the redirect normally.
  const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user && pathname.startsWith("/login") && isProtectedRoute(href)) {
      e.preventDefault();
    }
    setMenuOpen(false);
  };

  // Close the menu when navigating to a new route.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        "border-b backdrop-blur-xl",
        scrolled || menuOpen
          ? "border-border bg-background/80"
          : "border-transparent bg-background/60"
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logo />
          <span className="title-display text-lg tracking-tight">VibeVideo</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick(link.href)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-foreground sm:flex">
                <User className="h-4 w-4 text-accent-warm" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </div>
              <Button
                asChild
                size="sm"
                className="hidden text-primary-foreground hover:opacity-90 sm:inline-flex"
              >
                <Link href="/generate/">
                  <Sparkles className="h-4 w-4 text-accent-warm" />
                  {t.nav.startCreating}
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
                className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
                aria-label={t.nav.signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="hidden text-primary-foreground hover:opacity-90 sm:inline-flex"
            >
              <Link href="/login/">
                <LogIn className="h-4 w-4" />
                {t.nav.login}
              </Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
        >
          <div className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => {
              const href = link.mobileHref ?? link.href;
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : link.mobileHref
                    ? pathname.startsWith("/generate")
                    : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={href}
                  onClick={handleNavClick(href)}
                  className={cn(
                    "rounded-md px-4 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 flex items-center gap-3 border-t border-border px-4 pt-4">
              <ThemeSwitcher />
              <LanguageSwitcher />
              {user ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSignOut}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  {t.nav.signOut}
                </Button>
              ) : (
                <Button asChild size="sm" className="ml-auto">
                  <Link href="/login/">
                    <LogIn className="h-4 w-4" />
                    {t.nav.login}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
