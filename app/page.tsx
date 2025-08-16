import HeroSection from "./components/hero-section";
import BenefitsSection from "./components/benefits-section";
import WorkflowSection from "./components/workflow-section";
import CtaSection from "./components/cta-section";
import Footer from "./components/footer";
import ThemesSection from "./components/themes-section";
import { generatePageMetadata } from "@/lib/metadata";
import FaqsSection from "./components/faqs-section";
import WhatsAppFloating from "./components/whatsapp-floating";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Landing Page" });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <WhatsAppFloating />
      <HeroSection />
      <BenefitsSection />
      <ThemesSection />
      <WorkflowSection />
      <FaqsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
