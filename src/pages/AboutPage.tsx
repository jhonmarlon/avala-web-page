import { motion, useReducedMotion } from 'motion/react'
import { CtaLink } from '@/components/fx/CtaLink'
import { ProcessStageIcon } from '@/components/icons/ProcessStageIcon'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { aboutSectionContent, processSteps } from '@/features/home/data/content'

export function AboutPage() {
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
        <SectionLabel index="(01)" label="Nosotros" meta="Avala Group · Tecnología aplicada" />
        <h1 className="display-tight max-w-5xl pt-12 text-title-page lg:pt-16">
          <SplitReveal text="Visión técnica." stagger={0.018} play />
          <br />
          <SplitReveal text="Criterio de negocio." stagger={0.018} delay={0.25} play className="text-avala-neon" />
        </h1>
        <motion.div {...entrance} className="mt-12 grid gap-8 border-t border-avala-paper/15 pt-8 lg:grid-cols-12">
          <h2 className="display-tight text-2xl leading-tight sm:text-3xl lg:col-span-5">Construimos soluciones que acompañan tu evolución.</h2>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8">{aboutSectionContent.description}</p>
            <CtaLink to="/contacto" className="mt-8" cursor="Hablemos">Conversemos sobre tu proyecto</CtaLink>
          </div>
        </motion.div>
      </section>

      <section className="page-container pb-16 lg:pb-24">
        <SectionLabel index="(02)" label="Nuestro enfoque" meta="Negocio + tecnología" />
        <div className="grid gap-8 pt-10 lg:grid-cols-12">
          <h2 className="display-tight text-3xl sm:text-4xl lg:col-span-5">Conectar procesos.<br /><span className="text-avala-neon">Crear valor.</span></h2>
          <ul className="lg:col-span-6 lg:col-start-7">
            {aboutSectionContent.highlights.map((item, index) => (
              <motion.li
                key={item}
                {...entrance}
                transition={{ ...entrance.transition, delay: reducedMotion ? 0 : index * 0.08 }}
                className="flex gap-5 border-b border-avala-paper/15 py-5 first:pt-0"
              >
                <span className="hud-label tabular ordinal-index pt-1 text-avala-neon">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-lg leading-7 text-avala-paper/80">{item}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-container pb-24 lg:pb-32">
        <SectionLabel index="(03)" label="Así trabajamos" meta="Del descubrimiento a la evolución" />
        <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <motion.li
              key={step.step}
              {...entrance}
              transition={{ ...entrance.transition, delay: reducedMotion ? 0 : index * 0.08 }}
              whileHover={reducedMotion ? undefined : 'icon-hover'}
              className="process-stage-card border-b border-avala-paper/15 py-8 sm:pr-8"
            >
              <div className="flex items-center justify-between">
                <span className="display-tight text-outline tabular about-method-index">0{step.step}</span>
                <ProcessStageIcon stage={step.step} Icon={step.Icon} />
              </div>
              <h3 className="display-tight mt-6 text-2xl">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-avala-paper/70">{step.description}</p>
            </motion.li>
          ))}
          <motion.li
            {...entrance}
            transition={{ ...entrance.transition, delay: reducedMotion ? 0 : processSteps.length * 0.08 }}
            className="flex flex-col items-start justify-center gap-6 border-b border-avala-paper/15 py-8 sm:pr-8"
          >
            <p className="display-tight text-2xl">De la idea a la práctica.</p>
            <CtaLink to="/casos-de-exito" variant="line" cursor="Explorar">Explorá nuestros casos</CtaLink>
          </motion.li>
        </ol>
      </section>
    </div>
  )
}
