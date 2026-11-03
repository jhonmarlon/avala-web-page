import { useState } from 'react'
import { Preloader } from '@/components/fx/Preloader'
import { FinalCTASection } from '@/features/home/sections/FinalCTASection'
import { HeroSection } from '@/features/home/sections/HeroSection'
import { ManifestoSection } from '@/features/home/sections/ManifestoSection'
import { MarqueeSection } from '@/features/home/sections/MarqueeSection'
import { MetricsSection } from '@/features/home/sections/MetricsSection'
import { ProcessSection } from '@/features/home/sections/ProcessSection'
import { ProductsSection } from '@/features/home/sections/ProductsSection'
import { ServicesSection } from '@/features/home/sections/ServicesSection'
import { SuccessCasesSection } from '@/features/home/sections/SuccessCasesSection'

const PRELOADER_KEY = 'avala:preloader-seen'

// El preloader se muestra una vez por sesión
function hasSeenPreloader() {
  try {
    return sessionStorage.getItem(PRELOADER_KEY) === '1'
  } catch {
    return false
  }
}

export function HomePage() {
  const [showPreloader] = useState(() => !hasSeenPreloader())
  const [ready, setReady] = useState(!showPreloader)

  const handleDone = () => {
    try {
      sessionStorage.setItem(PRELOADER_KEY, '1')
    } catch {
      // Sin almacenamiento disponible: se mostrará de nuevo, sin consecuencias
    }
    setReady(true)
  }

  return (
    <div className="bg-avala-ink text-avala-paper [overflow-x:clip]">
      {showPreloader && <Preloader onDone={handleDone} />}
      <HeroSection ready={ready} />
      <MarqueeSection />
      <ManifestoSection />
      <MetricsSection />
      <ServicesSection />
      <ProcessSection />
      <SuccessCasesSection />
      <ProductsSection />
      <FinalCTASection />
    </div>
  )
}
