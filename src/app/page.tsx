import type { Metadata } from "next";

import { Hero } from "@/components/landing/hero";
import { Steps } from "@/components/landing/steps";
import { Showcase } from "@/components/landing/showcase";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";

export const metadata: Metadata = {
  title: "AI Video Generation Studio",
  description:
    "Generate cinematic, studio-quality videos from simple text prompts in seconds. VibeVideo's AI-powered studio turns your ideas into breathtaking video.",
  alternates: {
    canonical: "/",
  },
};

// Structured data (JSON-LD) describing VibeVideo as a WebApplication.
// Helps search engines understand the product and surface rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VibeVideo",
  url: "https://vibevideo.app",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web, Windows, macOS, Linux, iOS, Android",
  description:
    "AI-powered video generation studio that turns text prompts into cinematic, studio-quality video.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1284",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Steps />
      <Showcase />
      <Features />
      <Testimonials />
    </>
  );
}
