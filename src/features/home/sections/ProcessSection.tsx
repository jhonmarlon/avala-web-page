import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { processIntro, processSteps } from '@/features/home/data/content'
import { prefersReducedMotion } from '@/lib/smooth-scroll'
import { useMediaQuery } from '@/lib/use-media-query'

const ease = [0.76, 0, 0.24, 1] as const

function StepPanel({ step, index }: { step: (typeof processSteps)[number]; index: number }) {
  return (
    <article className="relative flex h-full shrink-0 flex-col justify-between border-avala-paper/15 py-10 lg:w-[min(64vw,56rem)] lg:border-l lg:px-12 lg:py-16">
      <div className="hud-label flex justify-between">
        <span className="tabular text-avala-neon">Etapa {String(index + 1).padStart(2, '0')}</span>
        <step.Icon className="size-5 text-avala-paper/60" strokeWidth={1.25} />
      </div>

      <p
        aria-hidden="true"
        className="display-tight text-outline tabular -ml-[0.06em] my-6 text-[clamp(8rem,30vh,22rem)] leading-[0.8] [--stroke-w:2px] [--stroke-c:rgba(238,242,255,0.85)] [filter:drop-shadow(0_0_12px_rgba(47,184,255,0.35))]"
      >
        {String(index + 1).padStart(2, '0')}
      </p>

      <div className="max-w-md space-y-4">
        <h3 className="display-tight text-[clamp(2.4rem,5vw,4.5rem)] leading-none text-avala-paper">{step.title}</h3>
        <p className="text-base leading-7 text-avala-paper/65">{step.description}</p>
      </div>
    </article>
  )
}

export function ProcessSection() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const pinned = isDesktop && !prefersReducedMotion()

  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!pinned) return
    const measure = () => {
      const track = trackRef.current
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (p) => -p * distance)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setCurrentStep(Math.min(processSteps.length - 1, Math.floor(p * processSteps.length)))
  })

  const intro = (
    <div className="flex shrink-0 flex-col justify-between py-10 lg:w-[min(42vw,36rem)] lg:py-16 lg:pr-12">
      <p className="display-tight text-[clamp(2.6rem,5.4vw,5rem)] leading-[0.95] text-avala-paper">
        {processIntro.title}.
        <span className="block text-avala-paper/35">Cinco etapas, cero improvisación.</span>
      </p>
      <p className="hud-label hidden lg:block">Desplazá para recorrer →</p>
    </div>
  )

  if (!pinned) {
    return (
      <section ref={rootRef} className="page-container relative py-24">
        <SectionLabel index="(04)" label="Proceso" meta="Metodología" />
        {intro}
        <div className="divide-y divide-avala-paper/15 border-t border-avala-paper/15">
          {processSteps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={rootRef} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
        <div className="page-container">
          <SectionLabel index="(04)" label="Proceso" meta="Metodología" />
        </div>

        <motion.div ref={trackRef} className="flex w-max flex-1 pl-[max(2rem,calc((100vw-1280px)/2+2rem))] pr-[20vw]" style={{ x }}>
          {intro}
          {processSteps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} />
          ))}
        </motion.div>

        {/* HUD de progreso */}
        <div className="page-container hud-label flex items-center gap-6 pb-8">
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
      </div>
    </section>
  )
}
