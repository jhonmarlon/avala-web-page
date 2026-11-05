import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { LucideIcon } from 'lucide-react'
import { NumberedStepPanel } from '@/components/ui/NumberedStepPanel'
import { usePageScrollPinScope } from '@/components/ui/PageScrollPinScope'
import { useMediaQuery } from '@/lib/use-media-query'

const ease = [0.76, 0, 0.24, 1] as const

type Step = { title: string; description: string; Icon: LucideIcon; label: string; illustration?: ReactNode }
type NumberedStepSequenceProps = {
  id?: string
  steps: readonly Step[]
  intro: ReactNode
  header?: ReactNode
  footer?: ReactNode
  ordered?: boolean
  /** Size the desktop track to content and keep its HUD nearby. Home keeps its default minimum. */
  compactTrack?: boolean
}

function LocalTimeline({ rootRef, pinned, height, children }: {
  rootRef: RefObject<HTMLDivElement | null>; pinned: boolean; height: number
  children: (progress: MotionValue<number>) => ReactNode
}) {
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', pinned ? `end ${height}px` : 'end end'] })
  return children(scrollYProgress)
}

function SequenceContent({ steps, intro, header, footer, ordered, compactTrack, mobile, pinned, distance, progress, trackRef }: NumberedStepSequenceProps & {
  mobile: boolean; pinned: boolean; distance: number; progress: MotionValue<number>; trackRef: RefObject<HTMLDivElement | null>
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const x = useTransform(progress, p => -Math.max(0, Math.min(1, p)) * distance)
  useMotionValueEvent(progress, 'change', p => {
    setCurrentStep(Math.max(0, Math.min(steps.length - 1, Math.floor(p * steps.length))))
  })
  const panels = renderPanels(steps, ordered, mobile)
  return <>
    {header && <div className="page-container">{header}</div>}
    <motion.div
      ref={trackRef}
      role={mobile && !pinned ? 'region' : undefined}
      aria-label={mobile && !pinned ? 'Pasos: desplazamiento horizontal' : undefined}
      tabIndex={mobile && !pinned ? 0 : undefined}
      data-lenis-prevent={mobile && !pinned ? 'true' : undefined}
      className={mobile
        ? 'flex gap-6 group-data-[layout=horizontal]/frame:w-max px-4 pr-[20vw] group-data-[layout=native]/frame:overflow-x-auto touch-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-avala-neon'
        : `flex ${compactTrack ? '' : 'group-data-[layout=horizontal]/frame:min-h-[clamp(24rem,50vh,30rem)] '}group-data-[layout=horizontal]/frame:w-max group-data-[layout=horizontal]/frame:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] group-data-[layout=horizontal]/frame:pr-[20vw] group-data-[layout=vertical]/frame:flex-col group-data-[layout=vertical]/frame:px-[max(2rem,calc((100vw-1280px)/2+2rem))] group-data-[layout=vertical]/frame:divide-y group-data-[layout=vertical]/frame:divide-avala-paper/15`}
      style={{ x: pinned ? x : 0 }}
    >
      {mobile ? <div className="shrink-0 w-[min(82vw,32rem)] break-words px-4">{intro}</div> : intro}
      {ordered ? <ol className={mobile ? 'flex shrink-0 gap-6' : 'flex group-data-[layout=vertical]/frame:flex-col group-data-[layout=vertical]/frame:divide-y group-data-[layout=vertical]/frame:divide-avala-paper/15'}>{panels}</ol> : panels}
    </motion.div>
    {mobile && <p className="page-container hud-label py-3 text-avala-paper/65">
      <span className="group-data-[layout=horizontal]/frame:hidden">Deslizá horizontalmente para ver todos los pasos →</span>
      <span className="hidden group-data-[layout=horizontal]/frame:inline">Desplazá hacia abajo para recorrer los pasos →</span>
    </p>}
    <div className={`page-container hud-label flex items-center ${mobile ? 'gap-2 group-data-[layout=native]/frame:hidden' : 'gap-6'} pb-6 group-data-[layout=vertical]/frame:hidden${compactTrack ? ' group-data-[layout=horizontal]/frame:mt-4' : ''}`}>
      <span className={mobile ? 'tabular shrink-0 text-avala-paper' : 'tabular text-avala-paper'}>{String(currentStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      <span className={`relative block h-5 ${mobile ? 'w-[min(36vw,9rem)] min-w-0' : 'w-36'} overflow-hidden`}>
        <motion.span key={currentStep} className="absolute inset-0 text-avala-paper" initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 0.45, ease }}>{steps[currentStep].title}</motion.span>
      </span>
      <span className={mobile ? 'relative h-px min-w-0 flex-1 bg-avala-paper/15' : 'relative h-px flex-1 bg-avala-paper/15'}>
        <motion.span className="absolute inset-0 origin-left bg-avala-neon" style={{ scaleX: progress }} />
      </span>
    </div>
    {footer && <div className="page-container">{footer}</div>}
  </>
}

function renderPanels(steps: readonly Step[], ordered?: boolean, mobile = false) {
  return steps.map((step, i) => {
    const panel = <NumberedStepPanel key={step.title} {...step} number={i + 1} mobileCompact={mobile} className="lg:w-[min(64vw,56rem)]" />
    const className = mobile ? 'shrink-0 w-[min(82vw,32rem)] break-words border-l border-avala-paper/15 px-4' : 'shrink-0'
    if (ordered) return <li key={step.title} className={className}>{panel}</li>
    return mobile ? <div key={step.title} className={className}>{panel}</div> : panel
  })
}

export function NumberedStepSequence(props: NumberedStepSequenceProps) {
  const { id, steps, intro, header, footer, ordered = false, compactTrack = false } = props
  const scope = usePageScrollPinScope()
  const register = scope?.register
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // Width chooses presentation, not eligibility: native vertical pans advance
  // the same document timeline on phones. Only motion preference opts out.
  const eligible = !reducedMotion
  const [fits, setFits] = useState(false)
  const [stickyHeight, setStickyHeight] = useState(0)
  const [distance, setDistance] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const pinned = eligible && (scope ? scope.active : fits)

  useLayoutEffect(() => {
    if (!eligible) return
    const frame = stickyRef.current
    const track = trackRef.current
    if (!frame || !track) return
    if (register) return register({ frame, track })
    const measure = () => {
      const layout = frame.dataset.layout
      try {
        frame.dataset.layout = 'horizontal'
        const height = frame.getBoundingClientRect().height
        setStickyHeight(height)
        setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
        setFits(height > 0 && height <= window.innerHeight && track.scrollWidth > window.innerWidth)
      } finally {
        frame.dataset.layout = layout
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(frame)
    window.addEventListener('resize', measure)
    document.fonts?.addEventListener('loadingdone', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      document.fonts?.removeEventListener('loadingdone', measure)
    }
  }, [eligible, compactTrack, register])

  // Keep frame/track refs mounted in native fallback so fonts/resize can reenter.
  const Root = ordered ? 'div' : 'section'
  if (isDesktop && !eligible) return (
    <Root id={id} ref={rootRef} className="page-container relative scroll-mt-24 pt-6 pb-0 lg:pt-10">
      {header}{intro}
      {ordered ? <ol className="divide-y divide-avala-paper/15 border-t border-avala-paper/15">{renderPanels(steps, ordered)}</ol> : <div className="divide-y divide-avala-paper/15 border-t border-avala-paper/15">{renderPanels(steps, ordered)}</div>}
      {footer}
    </Root>
  )
  const content = (progress: MotionValue<number>) => <SequenceContent {...props} mobile={!isDesktop} pinned={pinned} distance={scope ? scope.distance : distance} progress={progress} trackRef={trackRef} />
  return (
    <Root id={id} ref={rootRef} className="relative scroll-mt-24" style={!scope && pinned ? { height: stickyHeight + distance * 0.45 } : undefined}>
      <div ref={stickyRef} data-layout={pinned ? 'horizontal' : isDesktop ? 'vertical' : 'native'} className={`group/frame flex flex-col${scope ? '' : ' data-[layout=horizontal]:sticky data-[layout=horizontal]:top-0'} data-[layout=horizontal]:overflow-x-clip data-[layout=horizontal]:pt-24 data-[layout=native]:pt-6 data-[layout=vertical]:pt-10 data-[layout=vertical]:pb-0`}>
        {scope ? content(scope.progress) : <LocalTimeline rootRef={rootRef} pinned={pinned} height={stickyHeight}>{content}</LocalTimeline>}
      </div>
    </Root>
  )
}
