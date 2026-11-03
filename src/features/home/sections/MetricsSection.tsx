import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { metrics } from '@/features/home/data/content'

// Separa "120+" en número animable y sufijo; "24/7" → 24 y "/7"
function parseMetric(value: string) {
  const match = value.match(/^(\d+)(.*)$/)
  return match ? { target: Number(match[1]), suffix: match[2] } : { target: 0, suffix: value }
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const { target, suffix } = parseMetric(value)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target])

  return (
    <span ref={ref} className="tabular">
      {current}
      <span className="text-avala-neon">{suffix}</span>
    </span>
  )
}

export function MetricsSection() {
  return (
    <section id="home-metrics" className="scroll-mt-24 page-container pb-6 lg:pb-10">
      <SectionLabel index="(02)" label="En números" meta="Desde Medellín para LATAM" />

      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ value, label }, i) => (
          <motion.div
            key={label}
            className="group relative border-b border-avala-paper/15 py-8 pr-4 even:border-l even:pl-4 lg:border-b-0 lg:border-l lg:py-12 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
          >
            <p className="hud-label tabular mb-6">{String(i + 1).padStart(2, '0')} / {String(metrics.length).padStart(2, '0')}</p>
            <p className="display-tight text-[clamp(3rem,7vw,6.5rem)] leading-[0.85] text-avala-paper">
              <Counter value={value} />
            </p>
            <p className="mt-5 max-w-[16ch] text-sm leading-6 text-avala-paper/65">{label}</p>
          </motion.div>
        ))}
      </div>
      <SectionContinue targetId="home-services" />
    </section>
  )
}
