"use client";

import { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

/**
 * Custom frameless title bar for the Electron desktop build.
 *
 * The native Windows title bar is removed (`frame: false` in main.ts) and
 * replaced with this app-drawn bar so the window chrome matches the project's
 * design language. It provides a draggable region, the app mark/name, and
 * custom minimize / maximize / close buttons driven over IPC.
 *
 * It only renders when the Electron bridge is present (never in a browser),
 * so web deployments are unaffected.
 */
export function TitleBar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const bridge = window.vibeVideo;
    if (!bridge?.windowControls) return;
    setIsDesktop(true);

    // Shift the app's fixed header (Navbar) below the custom title bar.
    document.body.classList.add("has-title-bar");

    // Reflect the current maximize state and subscribe to changes.
    bridge.windowControls.isMaximized().then(setMaximized);
    const unsubscribe = bridge.windowControls.onMaximizedChange(setMaximized);
    return () => {
      document.body.classList.remove("has-title-bar");
      unsubscribe();
    };
  }, []);

  if (!isDesktop) return null;

  const controls = window.vibeVideo?.windowControls;
  if (!controls) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-[60] flex h-9 select-none items-stretch",
        "border-b border-border bg-background/80 backdrop-blur-xl",
        "pl-3"
      )}
    >
      {/* Draggable region fills the bar; buttons are the only non-draggable area. */}
      <div className="titlebar-drag flex flex-1 items-center gap-2">
        <Logo className="h-5 w-5 rounded-md" iconClassName="h-3 w-3" />
        <span className="title-display text-xs tracking-tight text-muted-foreground">
          VibeVideo
        </span>
      </div>

      {/* Window controls (non-draggable). */}
      <div className="titlebar-no-drag flex items-stretch">
        <button
          type="button"
          onClick={() => controls.minimize()}
          aria-label="Minimize"
          className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => controls.toggleMaximize()}
          aria-label={maximized ? "Restore" : "Maximize"}
          className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {maximized ? (
            <Copy className="h-3 w-3" />
          ) : (
            <Square className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => controls.close()}
          aria-label="Close"
          className="flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
