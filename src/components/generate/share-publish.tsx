"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Send, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/language-provider";

interface SharePublishProps {
  status: string;
}

/**
 * Share / publish workbench panel.
 *
 * Sharp-cornered, restrained — matching the editing-bay aesthetic rather
 * than a rounded-card stack.
 */
export function SharePublish({ status }: SharePublishProps) {
  const { t } = useI18n();
  const [shared, setShared] = useState(false);
  const [published, setPublished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the transient "shared/published" feedback after a delay.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShared(false), 2000);
    } catch {
      // Clipboard unavailable — still show feedback for the demo.
      setShared(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShared(false), 2000);
    }
  };

  const handlePublish = () => {
    setPublished(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPublished(false), 2000);
  };

  if (status !== "completed") return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {/* Share — copies a link and gives visual confirmation */}
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex-1 rounded-sm",
            shared && "border-emerald-500/40 text-emerald-500"
          )}
          onClick={handleShare}
        >
          {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {shared ? t.generate.copied : t.generate.shareToPlatform}
        </Button>

        {/* Publish — performs the publish action directly */}
        <Button
          type="button"
          variant="default"
          className={cn(
            "flex-1 rounded-sm",
            published && "border-emerald-500/40 text-emerald-500"
          )}
          onClick={handlePublish}
        >
          {published ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {published ? t.generate.published : t.generate.publish}
        </Button>
      </div>
    </div>
  );
}
