import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { lazy, Suspense, useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { companyInfo } from '@/config/site'
import { LocalClock } from '@/features/home/components/LocalClock'
import { heroContent, services } from '@/features/home/data/content'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { useMediaQuery } from '@/lib/use-media-query'

// Three.js va en un chunk aparte para no frenar la carga inicial
const GlobeCanvas = lazy(() =>
  import('@/features/home/components/GlobeCanvas').then((m) => ({ default: m.GlobeCanvas })),
)

const ease = [0.76, 0, 0.24, 1] as const

type HeroSectionProps = {
  ready: boolean
}

export function HeroSection({ ready }: HeroSectionProps) {
  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const scrollMotion = isDesktop && !reducedMotion
  const rootRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const wordLeft = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const wordRight = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const [before, after] = heroContent.title.split(heroContent.highlightedText)

  return (
    <section
      ref={rootRef}
      id="home-hero"
      className="scroll-mt-24 relative isolate flex flex-col overflow-hidden lg:min-h-[calc(100svh-5rem)]"
    >
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_85%)]" />

      {/* Barra superior de datos */}
      <motion.div
        className="page-container hud-label flex justify-between gap-4 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <p>
          <span className="text-avala-neon">(00)</span>&nbsp;&nbsp;{companyInfo.name} — Ingeniería de software
        </p>
        <p className="hidden sm:block">
          <LocalClock />
        </p>
      </motion.div>

      <div className="page-container grid flex-none gap-6 pt-8 pb-6 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:pt-10 lg:pb-20">
        <motion.div className="min-w-0 max-w-[40rem] space-y-8" style={{ y: scrollMotion ? copyY : 0, opacity: scrollMotion ? copyOpacity : 1 }}>
          <h1 className="display-tight text-[clamp(2.4rem,3.8vw,3.5rem)] leading-[1.02] text-avala-paper">
            <SplitReveal text={before.trim()} play={ready} stagger={0.012} delay={0.15} />{' '}
            <SplitReveal
              text={`${heroContent.highlightedText}${after}`}
              play={ready}
              stagger={0.012}
              delay={0.5}
              className="text-avala-neon"
            />
          </h1>

          <motion.div
            className="grid max-w-xl gap-8"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1, ease, delay: 1 }}
          >
            <p className="text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8">{heroContent.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaLink to={heroContent.primaryCta.to} cursor="Hablemos" className="sm:min-w-56">
                {heroContent.primaryCta.label}
              </CtaLink>
              <CtaLink to={heroContent.estimatorCta.to} variant="line" cursor="Estimar" className="sm:min-w-56">
                {heroContent.estimatorCta.label}
              </CtaLink>
            </div>
          </motion.div>
        </motion.div>

        {/* El globo reserva su espacio: debajo del texto en mobile, a la derecha en desktop. */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[24rem] lg:mx-0 lg:max-w-[40rem] lg:justify-self-end"
          style={{ y: scrollMotion ? globeY : 0, scale: scrollMotion ? globeScale : 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.6, ease, delay: 0.3 }}
        >
          <Suspense fallback={null}>
            <GlobeCanvas className="size-full touch-pan-y" />
          </Suspense>
        </motion.div>
      </div>

      {/* Pie del hero: datos + wordmark */}
      <div className="relative">
        <motion.div
          className="page-container hud-label flex items-end justify-between gap-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="tabular">
            {String(services.length).padStart(2, '0')} líneas de servicio · soporte 24/7
          </p>
        </motion.div>

        <div className="mx-auto w-full max-w-[48rem] overflow-hidden px-4 pt-4 pb-3 sm:px-6 lg:px-8">
          <p
            aria-hidden="true"
            className="display-tight mx-auto flex w-max whitespace-nowrap text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] text-avala-paper"
          >
            <motion.span className="inline-block" style={{ x: reducedMotion ? 0 : wordLeft }}>
              <SplitReveal text="AVALA" play={ready} delay={0.2} stagger={0.06} />
            </motion.span>
            <span className="inline-block w-[0.18em]" />
            <motion.span className="text-outline text-outline-neon inline-block [--stroke-w:2px]" style={{ x: reducedMotion ? 0 : wordRight }}>
              <SplitReveal text="GROUP" play={ready} delay={0.45} stagger={0.06} />
            </motion.span>
          </p>
        </div>
      </div>
      <div className="page-container">
        <SectionContinue targetId="home-services-strip" />
      </div>
    </section>
  )
}
