import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { Cursor } from '@/components/fx/Cursor'
import { Grain } from '@/components/fx/Grain'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { startSmoothScroll, stopSmoothScroll } from '@/lib/smooth-scroll'

export function PublicLayout() {
  useEffect(() => {
    startSmoothScroll()
    return stopSmoothScroll
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <ScrollToTop />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Cursor />
        <Grain />
      </div>
    </MotionConfig>
  )
}
