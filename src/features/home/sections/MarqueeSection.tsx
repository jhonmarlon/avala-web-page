import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { services } from '@/features/home/data/content'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

type RowProps = {
  items: string[]
  baseVelocity: number
  className?: string
  itemClassName?: string
}

function VelocityRow({ items, baseVelocity, className, itemClassName }: RowProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [10, 0, -10])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    move += direction.current * move * factor
    baseX.set(baseX.get() + move)
  })

  const content = [...items, ...items]

  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <motion.div className="flex w-max" style={{ x, skewX: skew }}>
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
  return (
    <section aria-label="Líneas de servicio" className="relative z-10 -my-2 overflow-hidden py-16 lg:py-24">
      <div className="-rotate-[2.2deg] scale-x-[1.04] bg-avala-neon py-3 text-avala-ink lg:py-4">
        <VelocityRow
          items={services.map((s) => s.title)}
          baseVelocity={-2.2}
          itemClassName="display-tight text-[clamp(2rem,5.4vw,4.6rem)] leading-none"
        />
      </div>
      <div className="mt-3 rotate-[1.4deg] scale-x-[1.04] border-y border-avala-paper/15 bg-avala-ink py-3 lg:py-4">
        <VelocityRow
          items={keywords}
          baseVelocity={1.6}
          itemClassName="display-tight text-outline text-[clamp(2rem,5.4vw,4.6rem)] leading-none [--stroke-w:1px] [--sep:var(--color-avala-neon)]"
        />
      </div>
    </section>
  )
}
