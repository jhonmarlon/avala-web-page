import { motion, useReducedMotion } from 'motion/react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { successCases } from '@/features/home/data/content'

export function SuccessCasesPage() {
  const reducedMotion = useReducedMotion()
  const entrance = {
    initial: reducedMotion ? false as const : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reducedMotion ? 0 : 0.7, delay: 0, ease: [0.76, 0, 0.24, 1] as const },
  }

  return (
    <div className="relative isolate bg-avala-ink text-avala-paper">
      <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <section className="page-container pt-10 pb-16 lg:pt-16 lg:pb-24">
        <SectionLabel index="(01)" label="Casos de éxito" meta="Proyectos seleccionados" />
        <h1 className="display-tight max-w-5xl pt-12 text-title-page lg:pt-16">
          <SplitReveal text="Tecnología aplicada." stagger={0.018} play />
          <br />
          <SplitReveal text="Impacto real." stagger={0.018} delay={0.25} play className="text-avala-neon" />
        </h1>
        <motion.p {...entrance} className="mt-10 max-w-2xl text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8">
          Automatización, plataformas e integración: así llevamos la tecnología a los procesos de negocio.
        </motion.p>
      </section>

      <section aria-label="Proyectos seleccionados" className="page-container pb-16 lg:pb-24">
        {successCases.map((item, index) => (
          <motion.article key={item.title} {...entrance} transition={{ ...entrance.transition, delay: reducedMotion ? 0 : Math.min(index, 4) * 0.08 }} className="grid items-center gap-8 border-t border-avala-paper/15 py-10 lg:grid-cols-12 lg:gap-12 lg:py-16">
            <figure className={index % 2 === 1 ? 'min-w-0 lg:order-2 lg:col-span-7' : 'min-w-0 lg:col-span-7'}>
              <div className="image-edge-fade aspect-[16/10] overflow-hidden">
                <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <figcaption className="hud-label mt-4">Caso {String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
            <div className={index % 2 === 1 ? 'min-w-0 lg:order-1 lg:col-span-5' : 'min-w-0 lg:col-span-5'}>
              <p className="display-tight tabular text-6xl text-avala-neon sm:text-7xl">{item.metric}</p>
              <p className="hud-label mt-3">{item.metricLabel}</p>
              <h2 className="display-tight mt-8 text-3xl sm:text-4xl">{item.title}</h2>
              <p className="mt-5 text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8">{item.description}</p>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="page-container pb-24 lg:pb-32">
        <SectionLabel index="(02)" label="El próximo desafío" meta="Construyámoslo juntos" />
        <motion.div {...entrance} className="flex flex-col items-start justify-between gap-8 pt-10 lg:flex-row lg:items-end">
          <h2 className="display-tight max-w-2xl text-4xl sm:text-5xl">¿Qué podemos transformar <span className="text-avala-neon">en tu empresa?</span></h2>
          <CtaLink to="/contacto" className="shrink-0" cursor="Hablemos">Hablemos de tu proyecto</CtaLink>
        </motion.div>
      </section>
    </div>
  )
}
