import HeroSection from "./_components/hero-section";
import ClientSection from "./_components/client-section";
import PricingSection from "./_components/pricing-section";
import CTASection from "./_components/cta-section";
import { SphereMask } from "@/components/ui/sphere-mask";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <SphereMask />
      <PricingSection />
      <CTASection />
    </>
  );
}
