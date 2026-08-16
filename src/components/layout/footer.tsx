"use client";

import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { useI18n } from "@/lib/i18n/language-provider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid gap-8 py-10 md:grid-cols-4 md:gap-10 md:py-14">
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="title-display text-lg text-foreground">
              VibeVideo
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">{t.footer.product}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">{t.footer.company}</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <p className="timecode text-xs tracking-[0.08em]">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">
              {t.footer.privacy}
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
