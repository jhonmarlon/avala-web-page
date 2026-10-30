import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef, useState } from 'react'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { cn } from '@/lib/utils'
import { services } from '@/features/home/data/content'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

type RowProps = {
  items: string[]
  baseVelocity: number
  paused: boolean
  inView: boolean
  className?: string
  itemClassName?: string
}

// Mount frame and scroll subscriptions only while a band is actually animating.
function VelocityDriver({ baseX, skewX, baseVelocity, directionRef }: {
  baseX: MotionValue<number>
  skewX: MotionValue<number>
  baseVelocity: number
  directionRef: { current: number }
}) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [10, 0, -10])
  useMotionValueEvent(skew, 'change', (value) => skewX.set(value))

  useAnimationFrame((_, delta) => {
    // Bound a delayed frame so resuming never catches up offscreen time.
    let move = directionRef.current * baseVelocity * (Math.min(delta, 64) / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) directionRef.current = -1
    else if (factor > 0) directionRef.current = 1
    move += directionRef.current * move * factor
    baseX.set(baseX.get() + move)
  })
  return null
}

function VelocityRow({ items, baseVelocity, paused, inView, className, itemClassName }: RowProps) {
  const reducedMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const skew = useMotionValue(0)
  const direction = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const active = inView && !paused && !reducedMotion

  if (reducedMotion) {
    return (
      <div className={cn('flex flex-wrap justify-center gap-x-6 gap-y-3 px-4', className)}>
        {items.map((item) => <span key={item} className={itemClassName}>{item}</span>)}
      </div>
    )
  }

  const content = [...items, ...items]

  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      {active && <VelocityDriver baseX={baseX} skewX={skew} baseVelocity={baseVelocity} directionRef={direction} />}
      <motion.div className="flex w-max" style={{ x, skewX: active ? skew : 0 }}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex">
            {content.map((item, i) => (
              <span key={`${copy}-${i}`} className={cn('flex items-center', itemClassName)}>
                {item}
                <span className="mx-[0.45em] inline-block size-[0.16em] rotate-45 bg-[var(--sep,currentColor)]" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const keywords = ['Medellín', 'Colombia', 'LATAM', 'APIs', 'Datos', 'Seguridad', 'Escalabilidad', 'Soporte 24/7']

export function MarqueeSection() {
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef)
  return (
    <section id="home-services-strip" ref={sectionRef} aria-label="Líneas de servicio" className="scroll-mt-24 relative z-10 overflow-hidden pt-12 pb-6 lg:pt-20 lg:pb-10">
      {!reducedMotion && (
        <div className="page-container mb-4 flex justify-end">
          <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="min-h-11 border border-avala-paper/30 px-4 text-sm text-avala-paper focus-visible:outline-2 focus-visible:outline-avala-neon">
            {paused ? 'Reanudar animación' : 'Pausar animación'}
          </button>
        </div>
      )}
      <div className="-rotate-[2.2deg] scale-x-[1.04] bg-avala-neon py-3 text-avala-ink lg:py-4">
        <VelocityRow
          items={services.map((s) => s.title)}
          baseVelocity={-2.2}
          paused={paused}
          inView={inView}
          itemClassName="display-tight text-[clamp(1.25rem,2.6vw,2.5rem)] leading-none"
        />
      </div>
      <div className="mt-3 rotate-[1.4deg] scale-x-[1.04] border-y border-avala-paper/15 bg-avala-ink py-3 lg:py-4">
        <VelocityRow
          items={keywords}
          baseVelocity={1.6}
          paused={paused}
          inView={inView}
          itemClassName="display-tight text-outline text-[clamp(1.25rem,2.6vw,2.5rem)] leading-none [--stroke-w:1px] [--sep:var(--color-avala-neon)]"
        />
      </div>
      <div className="page-container">
        <SectionContinue targetId="manifiesto" />
      </div>
    </section>
  )
}
