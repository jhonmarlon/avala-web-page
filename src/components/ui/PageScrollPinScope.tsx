import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useScroll, type MotionValue } from 'motion/react'
import { registerScrollTargetResolver } from '@/lib/smooth-scroll'

type Stage = { frame: HTMLDivElement; track: HTMLDivElement }
type Geometry = { height: number; offset: number; distance: number; coreHeight: number }
type PinScope = {
  register: (stage: Stage) => () => void
  progress: MotionValue<number>
  active: boolean
  distance: number
}
const Context = createContext<PinScope | null>(null)

// This route-owned boundary is stable even while its stage is absent or cannot fit.
export function PageScrollPinScope({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const scheduleRef = useRef<(() => void) | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const latest = useMemo(() => ({ geometry: null as Geometry | null }), [])
  const register = useCallback((stage: Stage) => {
    stageRef.current = stage
    observerRef.current?.observe(stage.frame)
    observerRef.current?.observe(stage.track)
    scheduleRef.current?.()
    return () => {
      if (stageRef.current !== stage) return
      observerRef.current?.unobserve(stage.frame)
      observerRef.current?.unobserve(stage.track)
      stageRef.current = null
      latest.geometry = null
      setGeometry(null)
    }
  }, [latest])

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let pending = 0
    let disposed = false
    const measure = () => {
      pending = 0
      const stage = stageRef.current
      if (disposed || !stage) return
      const layout = stage.frame.dataset.layout
      try {
        // Measure the same compact step DOM, including its natural header/HUD.
        stage.frame.dataset.layout = 'horizontal'
        const core = stage.frame.getBoundingClientRect()
        const whole = frame.getBoundingClientRect()
        const distance = Math.max(0, stage.track.scrollWidth - window.innerWidth)
        const next = core.height > 0 && core.height <= window.innerHeight && distance > 0
          ? { height: whole.height, offset: Math.max(0, core.top - whole.top), distance, coreHeight: core.height }
          : null
        latest.geometry = next
        setGeometry(previous => previous?.height === next?.height && previous?.offset === next?.offset && previous?.distance === next?.distance && previous?.coreHeight === next?.coreHeight ? previous : next)
      } finally {
        stage.frame.dataset.layout = layout
      }
    }
    const schedule = () => {
      if (!pending && !disposed) pending = requestAnimationFrame(measure)
    }
    scheduleRef.current = schedule
    const observer = new ResizeObserver(schedule)
    observerRef.current = observer
    observer.observe(frame)
    if (stageRef.current) {
      observer.observe(stageRef.current.frame)
      observer.observe(stageRef.current.track)
    }
    // Initial measurement before paint; subsequent resize/font work is coalesced.
    measure()
    window.addEventListener('resize', schedule)
    document.fonts?.addEventListener('loadingdone', schedule)
    return () => {
      disposed = true
      cancelAnimationFrame(pending)
      scheduleRef.current = null
      observerRef.current = null
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      document.fonts?.removeEventListener('loadingdone', schedule)
    }
  }, [latest])

  const active = geometry !== null
  useLayoutEffect(() => {
    if (!active) return
    return registerScrollTargetResolver(target => {
      const current = latest.geometry
      const stage = stageRef.current
      const frame = frameRef.current
      const root = rootRef.current
      if (!current || !stage || !frame || !root || !frame.contains(target) || stage.track.contains(target)) return
      const frameTop = frame.getBoundingClientRect().top
      const naturalTop = target.getBoundingClientRect().top - frameTop
      const coreBottom = current.offset + current.coreHeight
      const after = !target.contains(stage.frame) && naturalTop >= coreBottom
      // Remove the current sticky translation; only post-core targets include
      // the complete reserve, irrespective of progress or released position.
      return root.getBoundingClientRect().top - frameTop + (after ? current.distance * 0.45 : 0)
    })
  }, [active, latest])

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: geometry ? [`start ${-geometry.offset}px`, `end ${geometry.height - geometry.offset}px`] : ['start start', 'end end'],
  })
  const value = useMemo(() => ({ register, progress: scrollYProgress, active: geometry !== null, distance: geometry?.distance ?? 0 }), [register, scrollYProgress, geometry])
  return (
    <Context.Provider value={value}>
      <div ref={rootRef} data-page-pin-scope="" style={geometry ? { height: geometry.height + geometry.distance * 0.45 } : undefined}>
        <div ref={frameRef} data-page-pin-frame="" style={geometry ? { position: 'sticky', top: -geometry.offset } : undefined}>
          {children}
        </div>
      </div>
    </Context.Provider>
  )
}

// The hook and provider intentionally share this small route-only context.
// eslint-disable-next-line react-refresh/only-export-components
export function usePageScrollPinScope() {
  return useContext(Context)
}
