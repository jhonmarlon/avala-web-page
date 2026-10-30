import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { processIntro, processSteps } from '@/features/home/data/content'
import { useMediaQuery } from '@/lib/use-media-query'

const ease = [0.76, 0, 0.24, 1] as const

function StepPanel({ step, index }: { step: (typeof processSteps)[number]; index: number }) {
  return (
    <article className="relative flex shrink-0 flex-col gap-4 border-avala-paper/15 py-8 lg:w-[min(64vw,56rem)] lg:border-l lg:px-8 lg:py-6">
      <div className="hud-label flex justify-between">
        <span className="tabular text-avala-neon">Etapa {String(index + 1).padStart(2, '0')}</span>
        <step.Icon className="size-5 text-avala-paper/60" strokeWidth={1.25} />
      </div>

      <p
        aria-hidden="true"
        className="display-tight text-outline tabular -ml-[0.06em] my-2 text-[clamp(5rem,8vw,7rem)] leading-[0.8] [--stroke-w:2px] [--stroke-c:rgba(238,242,255,0.85)] [filter:drop-shadow(0_0_12px_rgba(47,184,255,0.35))]"
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <div className="max-w-md space-y-4">
        <h3 className="display-tight text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] text-avala-paper">{step.title}</h3>
        <p className="text-base leading-7 text-avala-paper/65 sm:text-lg sm:leading-8">{step.description}</p>
      </div>
    </article>
  )
}

export function ProcessSection() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const eligible = isDesktop && !reducedMotion
  const [fits, setFits] = useState(false)
  const pinned = eligible && fits

  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [stickyHeight, setStickyHeight] = useState(0)
  const [distance, setDistance] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useLayoutEffect(() => {
    if (!eligible) return
    const frame = stickyRef.current
    const track = trackRef.current
    if (!frame || !track) return
    const measure = () => {
      // Measure the SAME content in its compact horizontal layout, even while
      // vertical. Restore before paint; no duplicate/offscreen accessible tree.
      const layout = frame.dataset.layout
      frame.dataset.layout = 'horizontal'
      const height = frame.getBoundingClientRect().height
      const travel = Math.max(0, track.scrollWidth - window.innerWidth)
      frame.dataset.layout = layout
      setStickyHeight(height)
      setDistance(travel)
      setFits(height > 0 && height <= window.innerHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(frame)
    window.addEventListener('resize', measure)
    // Font metrics can change after an initial vertical fallback as well.
    document.fonts?.addEventListener('loadingdone', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      document.fonts?.removeEventListener('loadingdone', measure)
    }
  }, [eligible])

  // Shorten vertical scrolling without reducing the track's full horizontal travel.
  const scrollBudget = distance * 0.45

  // With root height = frame + budget, this endpoint releases the sticky frame
  // after exactly the budget, when progress reaches 1 and x reaches -distance.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', pinned ? `end ${stickyHeight}px` : 'end end'],
  })
  const x = useTransform(scrollYProgress, (p) => -p * distance)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setCurrentStep(Math.min(processSteps.length - 1, Math.floor(p * processSteps.length)))
  })

  const intro = (
    <div className="flex shrink-0 flex-col justify-between gap-6 py-6 lg:w-[min(42vw,36rem)] lg:pr-8">
      <p className="display-tight text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-avala-paper">
        {processIntro.title}.
        <span className="block text-avala-paper/35">Cinco etapas, cero improvisación.</span>
      </p>
      <p className="hud-label hidden lg:block">Desplazá para recorrer →</p>
    </div>
  )

  if (!eligible) {
    return (
      <section id="home-process" ref={rootRef} className="page-container relative scroll-mt-24 pt-6 pb-0 lg:pt-10">
        <SectionLabel index="(04)" label="Proceso" meta="Metodología" />
        {intro}
        <div className="divide-y divide-avala-paper/15 border-t border-avala-paper/15">
          {processSteps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} />
          ))}
        </div>
        <SectionContinue targetId="home-cases" />
      </section>
    )
  }

  return (
    <section id="home-process" ref={rootRef} className="relative scroll-mt-24" style={pinned ? { height: stickyHeight + scrollBudget } : undefined}>
      <div
        ref={stickyRef}
        data-layout={pinned ? 'horizontal' : 'vertical'}
        className="group/frame flex flex-col data-[layout=horizontal]:sticky data-[layout=horizontal]:top-0 data-[layout=horizontal]:overflow-x-clip data-[layout=horizontal]:pt-24 data-[layout=vertical]:pt-10 data-[layout=vertical]:pb-0"
      >
        <div className="page-container">
          <SectionLabel index="(04)" label="Proceso" meta="Metodología" />
        </div>

        <motion.div
          ref={trackRef}
          className="flex group-data-[layout=horizontal]/frame:min-h-[clamp(24rem,50vh,30rem)] group-data-[layout=horizontal]/frame:w-max group-data-[layout=horizontal]/frame:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] group-data-[layout=horizontal]/frame:pr-[20vw] group-data-[layout=vertical]/frame:flex-col group-data-[layout=vertical]/frame:px-[max(2rem,calc((100vw-1280px)/2+2rem))] group-data-[layout=vertical]/frame:divide-y group-data-[layout=vertical]/frame:divide-avala-paper/15"
          style={{ x: pinned ? x : 0 }}
        >
          {intro}
          {processSteps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} />
          ))}
        </motion.div>

        {/* HUD de progreso */}
        <div className="page-container hud-label flex items-center gap-6 pb-6 group-data-[layout=vertical]/frame:hidden">
          <span className="tabular text-avala-paper">
            {String(currentStep + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
          </span>
          <span className="relative block h-5 w-36 overflow-hidden">
            <motion.span
              key={currentStep}
              className="absolute inset-0 text-avala-paper"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.45, ease }}
            >
              {processSteps[currentStep].title}
            </motion.span>
          </span>
          <span className="relative h-px flex-1 bg-avala-paper/15">
            <motion.span className="absolute inset-0 origin-left bg-avala-neon" style={{ scaleX: scrollYProgress }} />
          </span>
        </div>
        <div className="page-container">
          <SectionContinue targetId="home-cases" />
        </div>
      </div>
    </section>
  )
}
