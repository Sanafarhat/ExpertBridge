import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import WorkflowSection from "@/components/landing/WorkflowSection";
import InstitutionSection from "@/components/landing/InstitutionSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import ExpertSection from "@/components/landing/ExpertSection";
import AboutSection from "@/components/landing/AboutSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFC] font-sans selection:bg-[#6046D8]/20 selection:text-[#171942]">
      
      {/* Announcement Bar */}
      <div className="bg-[#171942] text-white text-xs font-medium py-2.5 px-4 text-center">
        <span className="opacity-90">AI-assisted verification for trusted expert engagement</span>
        <a href="#how-it-works" className="ml-3 text-[#7657E8] hover:text-white transition-colors font-bold inline-flex items-center gap-1">
          Explore ExpertBridge &rarr;
        </a>
      </div>

      <Navbar />

      {/* Assembly of Redesigned Components */}
      <Hero />
      <WorkflowSection />
      <InstitutionSection />
      <ComparisonSection />
      <ExpertSection />
      <AboutSection />
      <Footer />
      
    </main>
  );
}
