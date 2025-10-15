import HeroSection from "./_components/hero-section"
import LogoCloud from "./_components/logo-cloud"
import PricingSection from "./_components/pricing-section"
import CTASection from "./_components/cta-section"
import { SphereMask } from "@/components/ui/sphere-mask"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <SphereMask />
      <PricingSection />
      <CTASection />
    </>
  )
}
