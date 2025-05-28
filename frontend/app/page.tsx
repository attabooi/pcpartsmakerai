"use client";

import Header from "./components/Header";
import HeroSectionLanding from "./components/HeroSectionLanding";
import KeyFeaturesSection from "./components/KeyFeaturesSection";
import TierListSectionLanding from "./components/TierListSectionLanding";
import FooterLanding from "./components/FooterLanding";
// You can add other sections like DataReportSection, BuildPcSection later if needed

export default function LandingPage() {
  return (
    <div className="font-sans bg-black text-slate-100">
      <Header />
      <main>
        <HeroSectionLanding />
        <KeyFeaturesSection />
        <TierListSectionLanding />
        {/* 
          Placeholder for other sections you requested in the past but weren't part of this specific Framer redesign prompt.
          You can re-integrate or redesign them as needed.
          <DataReportSection /> 
          <BuildPcSection />
        */}
      </main>
      <FooterLanding />
    </div>
  );
}
