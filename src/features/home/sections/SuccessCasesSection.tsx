import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { successCases, successCasesIntro } from '@/features/home/data/content'
import { cn } from '@/lib/utils'

const ease = [0.76, 0, 0.24, 1] as const

function CaseRow({ item, index }: { item: (typeof successCases)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const reversed = index % 2 === 1

  return (
    <article ref={ref} className="grid gap-8 border-b border-avala-paper/15 py-12 lg:grid-cols-12 lg:gap-12 lg:py-20">
      <motion.figure
        className={cn('relative aspect-[4/3] overflow-hidden bg-avala-ink-2 lg:col-span-7', reversed && 'lg:order-2 lg:col-start-6')}
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.3, ease }}
        data-cursor="Caso"
      >
        <motion.img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 h-[124%] w-full -translate-y-[12%] object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
          style={{ y: imageY }}
        />
        <figcaption className="hud-label absolute left-4 top-4 bg-avala-ink px-2 py-1 text-avala-paper">
          Caso {String(index + 1).padStart(2, '0')}
        </figcaption>
      </motion.figure>

      <div className={cn('flex flex-col justify-between gap-10 lg:col-span-5', reversed && 'lg:order-1 lg:col-span-4')}>
        <motion.p
          className="display-tight tabular text-[clamp(4.5rem,10vw,9.5rem)] leading-[0.82] text-avala-neon"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease }}
        >
          {item.metric}
        </motion.p>
        <div className="space-y-4">
          <p className="hud-label">{item.metricLabel}</p>
          <h3 className="display-tight text-[clamp(1.9rem,3vw,2.8rem)] leading-none text-avala-paper">{item.title}</h3>
          <p className="max-w-md text-base leading-7 text-avala-paper/65">{item.description}</p>
        </div>
      </div>
    </article>
  )
}

export function SuccessCasesSection() {
  return (
    <section className="page-container py-24 lg:py-40">
      <SectionLabel
        index="(05)"
        label={successCasesIntro.title}
        meta={`${String(successCases.length).padStart(2, '0')} proyectos seleccionados`}
      />
      {successCases.map((item, i) => (
        <CaseRow key={item.title} item={item} index={i} />
      ))}
      <div className="flex justify-end pt-10">
        <CtaLink to="/casos-de-exito" variant="line" cursor="Ver todos">
          Ver todos los casos
        </CtaLink>
      </div>
    </section>
  )
}
