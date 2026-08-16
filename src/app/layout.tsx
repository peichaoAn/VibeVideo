import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { PlanProvider } from "@/lib/plan/plan-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TitleBar } from "@/components/layout/title-bar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://vibevideo.app";
const SITE_NAME = "VibeVideo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VibeVideo — AI Video Generation Studio",
    template: "%s — VibeVideo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  description:
    "Turn your imagination into stunning video with VibeVideo's AI-powered creation studio. Generate cinematic, studio-quality videos from simple text prompts in seconds.",
  keywords: [
    "AI video generator",
    "text to video",
    "AI video creation",
    "video generation studio",
    "AI content creation",
    "text-to-video",
    "AI 视频生成",
    "文生视频",
    "AI 视频创作",
  ],
  authors: [{ name: "VibeVideo" }],
  creator: "VibeVideo",
  publisher: "VibeVideo",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      zh: "/zh",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "VibeVideo — AI Video Generation Studio",
    description:
      "Turn your imagination into stunning video with VibeVideo's AI-powered creation studio.",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeVideo — AI Video Generation Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeVideo — AI Video Generation Studio",
    description:
      "Turn your imagination into stunning video with VibeVideo's AI-powered creation studio.",
    images: ["/og-image.png"],
    creator: "@vibevideo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

// Inline script that runs before hydration to lock in the persisted locale and
// theme mode. This prevents a flash of the default locale or theme before
// React mounts.
const preHydrationScript = `
(function () {
  try {
    var root = document.documentElement;

    var locale = localStorage.getItem('vibevideo-locale');
    root.lang = locale === 'zh' ? 'zh' : 'en';
    root.setAttribute('data-locale', root.lang);

    var mode = localStorage.getItem('vibevideo-mode');
    var isDark = mode !== 'light';
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);

    // Paint the background immediately (before CSS loads) so a full page
    // reload never flashes white. The static-export + Electron build performs
    // a full document reload on every route change, and without an early
    // background the blank window shows the browser default (white) for a
    // frame — the "flash" reported on navigation.
    var bg = isDark ? '#0a0a0b' : '#ffffff';
    root.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#0a0a0b';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PlanProvider>
              <div className="flex min-h-screen flex-col">
                <TitleBar />
                <Navbar />
                <main className="flex-1 pt-16 pb-20 md:pb-0">{children}</main>
                <div className="hidden md:block">
                  <Footer />
                </div>
                <MobileNav />
              </div>
              </PlanProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
