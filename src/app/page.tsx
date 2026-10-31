"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Hero } from "@/components/features/Hero";
import { FeatureStrip } from "@/components/features/FeatureStrip";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
      </main>
      <FeatureStrip />
      <Footer />
    </>
  );
}
