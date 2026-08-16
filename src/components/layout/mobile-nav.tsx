"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Library, User, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/language-provider";
import { isProtectedRoute } from "@/lib/routes";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const ITEMS = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/library/", label: t.nav.library, icon: Library },
    { href: "/generate/", label: t.nav.generate, icon: Sparkles },
    { href: "/pricing/", label: t.nav.pricing, icon: CreditCard },
    { href: "/profile/", label: t.nav.profile, icon: User },
  ];

  // Block navigation to protected routes while on the login page (avoids the
  // flash of navigating out and being bounced straight back).
  const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname.startsWith("/login") && isProtectedRoute(href)) {
      e.preventDefault();
    }
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl md:hidden">
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick(item.href)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors",
                active && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
