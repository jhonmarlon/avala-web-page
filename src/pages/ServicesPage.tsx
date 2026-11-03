import { motion, useReducedMotion } from 'motion/react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { services } from '@/config/services'

export function ServicesPage() {
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
        <SectionLabel index="(01)" label="Soluciones" meta={`${String(services.length).padStart(2, '0')} líneas de servicio`} />
        <h1 className="display-tight max-w-5xl pt-12 text-title-page lg:pt-16">
          <SplitReveal text="Tu próximo paso." stagger={0.018} play />
          <br />
          <SplitReveal text="Nuestra tecnología." stagger={0.018} delay={0.25} play className="text-avala-neon" />
        </h1>
        <motion.div {...entrance} className="mt-12 flex flex-col items-start gap-8 border-t border-avala-paper/15 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8">
            Conectamos estrategia, desarrollo y operación para resolver desafíos concretos de tu empresa.
          </p>
          <CtaLink to="/contacto" className="shrink-0" cursor="Hablemos">Solicitar asesoría</CtaLink>
        </motion.div>
      </section>

      <section aria-label="Catálogo de soluciones" className="page-container pb-16 lg:pb-24">
        <ul className="border-t border-avala-paper/15">
          {services.map((service, index) => (
            <motion.li key={service.title} {...entrance} transition={{ ...entrance.transition, delay: reducedMotion ? 0 : Math.min(index, 4) * 0.08 }} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-avala-paper/15 py-8 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_2.5rem] lg:items-center lg:gap-8 lg:py-10">
              <span className="hud-label tabular pt-1 text-avala-neon">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="display-tight text-2xl sm:text-3xl">{service.title}</h2>
              <p className="col-start-2 text-base leading-7 text-avala-paper/70 lg:col-start-auto">{service.description}</p>
              <service.Icon aria-hidden="true" className="hidden size-8 text-avala-neon lg:block" strokeWidth={1.25} />
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="page-container pb-24 lg:pb-32">
        <SectionLabel index="(02)" label="Configurador inteligente" meta="Definí tu punto de partida" />
        <motion.div {...entrance} className="mt-10 grid gap-8 border border-avala-paper/15 bg-avala-ink-2 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 className="display-tight max-w-2xl text-3xl sm:text-4xl">¿Todavía no tenés claro el <span className="text-avala-neon">alcance de tu solución?</span></h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-avala-paper/70">
              Configurá tu proyecto y obtené una estimación preliminar de complejidad, tiempo e inversión.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <CtaLink to="/estimar-proyecto" cursor="Estimar">Estimar mi proyecto</CtaLink>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
