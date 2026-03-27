"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { PackagesSection } from "@/components/packages-section";
import { CostsSection } from "@/components/costs-section";
import { FAQSection } from "@/components/faq-section";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { CalendlyModal } from "@/components/calendly-modal";

export default function HomePage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const openCalendly = () => setIsCalendlyOpen(true);
  const closeCalendly = () => setIsCalendlyOpen(false);

  return (
    <>
      <Header onBookClick={openCalendly} />
      <main>
        <Hero onBookClick={openCalendly} />
        <ProblemSection />
        <SolutionSection />
        <PackagesSection onBookClick={openCalendly} />
        <CostsSection />
        <FAQSection />
        <FinalCTA onBookClick={openCalendly} />
      </main>
      <Footer />
      <CalendlyModal
        isOpen={isCalendlyOpen}
        onClose={closeCalendly}
        calendlyUrl="https://calendly.com/your-username/consultation"
      />
    </>
  );
}
