import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { successCases, successCasesIntro } from '@/features/home/data/content'
import { cn } from '@/lib/utils'

const ease = [0.76, 0, 0.24, 1] as const

function CaseRow({ item, index }: { item: (typeof successCases)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const reversed = index % 2 === 1

  return (
    <article ref={ref} className="grid items-center gap-6 border-b border-avala-paper/15 py-8 lg:grid-cols-12 lg:gap-10 lg:py-10">
      <motion.figure
        className={cn('relative aspect-[16/10] overflow-hidden bg-avala-ink-2 lg:col-span-7', reversed && 'lg:order-2 lg:col-start-6')}
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeOut' }}
        data-cursor="Caso"
      >
        <motion.img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
          style={{ y: reducedMotion ? 0 : imageY }}
        />
        <figcaption className="hud-label absolute left-4 top-4 bg-avala-ink px-2 py-1 text-avala-paper">
          Caso {String(index + 1).padStart(2, '0')}
        </figcaption>
      </motion.figure>

      <div className={cn('flex flex-col gap-4 lg:col-span-5', reversed && 'lg:order-1 lg:col-span-4')}>
        <motion.p
          className="display-tight tabular text-[clamp(3rem,5vw,4.5rem)] leading-[1.05] text-avala-neon"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease }}
        >
          {item.metric}
        </motion.p>
        <div className="space-y-4">
          <p className="hud-label">{item.metricLabel}</p>
          <h3 className="display-tight text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.15] text-avala-paper">{item.title}</h3>
          <p className="max-w-md text-base leading-7 text-avala-paper/65 sm:text-lg sm:leading-8">{item.description}</p>
        </div>
      </div>
    </article>
  )
}

export function SuccessCasesSection() {
  return (
    <section id="home-cases" className="scroll-mt-24 page-container pt-6 pb-6 lg:pt-8 lg:pb-10">
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
      <SectionContinue targetId="home-products" />
    </section>
  )
}
