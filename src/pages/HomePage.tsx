import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import {
  HowItWorksSection,
  MarketplaceSection,
  ExpertsSection,
  CommunitySection,
  AnalyticsSection,
  PricingSection,
  ContactSection,
} from '@/components/sections/AllSections'
import { useScrollRevealAll } from '@/hooks/useScrollReveal'

export default function HomePage() {
  useScrollRevealAll()

  // Initialize reveal elements
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      [data-reveal] {
        opacity: 0;
        transform: translateY(2rem);
        transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1);
      }
      [data-reveal].opacity-100 {
        opacity: 1;
        transform: translateY(0);
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketplaceSection />
        <ExpertsSection />
        <CommunitySection />
        <AnalyticsSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
