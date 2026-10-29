import { motion, useScroll, useTransform } from 'motion/react'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { companyInfo } from '@/config/site'
import { LocalClock } from '@/features/home/components/LocalClock'
import { heroContent, services } from '@/features/home/data/content'
import { scrollToTarget } from '@/lib/smooth-scroll'

// Three.js va en un chunk aparte para no frenar la carga inicial
const GlobeCanvas = lazy(() =>
  import('@/features/home/components/GlobeCanvas').then((m) => ({ default: m.GlobeCanvas })),
)

const ease = [0.76, 0, 0.24, 1] as const

type HeroSectionProps = {
  ready: boolean
}

export function HeroSection({ ready }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-35%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const wordLeft = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const wordRight = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  // El wordmark ocupa exactamente el ancho disponible
  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const available = el.parentElement?.clientWidth ?? window.innerWidth
      el.style.fontSize = `${Math.floor((100 * available) / el.scrollWidth)}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const observer = new ResizeObserver(fit)
    if (el.parentElement) observer.observe(el.parentElement)
    return () => observer.disconnect()
  }, [])

  const [before, after] = heroContent.title.split(heroContent.highlightedText)

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden lg:min-h-[calc(100svh-5rem)]"
    >
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_85%)]" />

      {/* Globo */}
      <motion.div
        className="absolute inset-y-0 right-[-30%] -z-10 w-[130%] sm:right-[-12%] sm:w-[90%] lg:right-[-4%] lg:w-[62%]"
        style={{ y: globeY, scale: globeScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.6, ease, delay: 0.3 }}
      >
        <Suspense fallback={null}>
          <GlobeCanvas className="size-full touch-pan-y" />
        </Suspense>
      </motion.div>

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

      <motion.div className="page-container relative flex flex-1 flex-col justify-center py-14 lg:py-10" style={{ y: copyY, opacity: copyOpacity }}>
        <div className="max-w-[40rem] space-y-8">
          <h1 className="display-tight text-[clamp(2.4rem,4.9vw,4.6rem)] leading-[0.95] text-avala-paper">
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
        </div>
      </motion.div>

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
          <button
            type="button"
            onClick={() => scrollToTarget('#manifiesto')}
            className="group flex items-center gap-3 text-avala-paper"
            data-cursor="Bajar"
          >
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-avala-paper/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-avala-neon"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </button>
        </motion.div>

        <div className="overflow-hidden px-4 sm:px-6 lg:px-8">
          <p
            ref={wordmarkRef}
            aria-hidden="true"
            className="display-tight flex w-max whitespace-nowrap leading-[0.74] text-avala-paper"
            style={{ marginBottom: '-0.06em' }}
          >
            <motion.span className="inline-block" style={{ x: wordLeft }}>
              <SplitReveal text="AVALA" play={ready} delay={0.2} stagger={0.06} />
            </motion.span>
            <span className="inline-block w-[0.18em]" />
            <motion.span className="text-outline text-outline-neon inline-block [--stroke-w:2px]" style={{ x: wordRight }}>
              <SplitReveal text="GROUP" play={ready} delay={0.45} stagger={0.06} />
            </motion.span>
          </p>
        </div>
      </div>
    </section>
  )
}
