import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, useMatches } from 'react-router'
import { PageScrollPinScope } from '@/components/ui/PageScrollPinScope'
import { Cursor } from '@/components/fx/Cursor'
import { Grain } from '@/components/fx/Grain'
import { GlobalWaveWatermark } from '@/components/fx/GlobalWaveWatermark'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { startSmoothScroll, stopSmoothScroll } from '@/lib/smooth-scroll'
import { useMediaQuery } from '@/lib/use-media-query'

export function PublicLayout() {
  const pageScrollPin = useMatches().some(match => (match.handle as { pageScrollPin?: boolean } | undefined)?.pageScrollPin)
  const content = <><main><Outlet /></main><Footer /></>
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  useEffect(() => {
    if (!reducedMotion) startSmoothScroll()
    return stopSmoothScroll
  }, [reducedMotion])

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <ScrollToTop />
        <Header />
        {pageScrollPin ? <PageScrollPinScope>{content}</PageScrollPinScope> : content}
        <Cursor />
        <Grain />
        <GlobalWaveWatermark />
      </div>
    </MotionConfig>
  )
}
