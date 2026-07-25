import { AboutSection } from '@/features/home/sections/AboutSection'
import { FinalCTASection } from '@/features/home/sections/FinalCTASection'
import { HeroSection } from '@/features/home/sections/HeroSection'
import { MetricsSection } from '@/features/home/sections/MetricsSection'
import { ProcessSection } from '@/features/home/sections/ProcessSection'
import { ServicesSection } from '@/features/home/sections/ServicesSection'
import { SuccessCasesSection } from '@/features/home/sections/SuccessCasesSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <ServicesSection />
      <ProcessSection />
      <SuccessCasesSection />
      <AboutSection />
      <FinalCTASection />
    </>
  )
}
