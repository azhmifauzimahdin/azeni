import HeroSection from "./components/hero-section";
import BenefitsSection from "./components/benefits-section";
import WorkflowSection from "./components/workflow-section";
import CtaSection from "./components/cta-section";
import Footer from "./components/footer";
import ThemesSection from "./components/themes-section";
import { generatePageMetadata } from "@/lib/metadata";
import FaqsSection from "./components/faqs-section";
import WhatsAppFloating from "./components/whatsapp-floating";
import FeaturesSection from "./components/features-section";

export const generateMetadata = () =>
  generatePageMetadata({ fallbackTitle: "Undangan Digital" });

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <WhatsAppFloating />
      <HeroSection />
      <BenefitsSection />
      <ThemesSection />
      <FeaturesSection />
      <WorkflowSection />
      <CtaSection />
      <FaqsSection />
      <Footer />
    </div>
  );
}
