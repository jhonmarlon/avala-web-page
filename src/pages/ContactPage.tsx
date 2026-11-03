import { motion, useReducedMotion } from 'motion/react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { companyInfo } from '@/config/site'
import { ContactChannelList } from '@/features/contact/components/ContactChannelList'
import { ContactForm } from '@/features/contact/components/ContactForm'
import { LocalClock } from '@/components/ui/LocalClock'

const ease = [0.76, 0, 0.24, 1] as const

const nextSteps = [
  { title: 'Recibimos tu mensaje.', description: 'Leemos lo que nos contás para entender tu consulta.' },
  { title: 'Lo acercamos al equipo indicado.', description: 'Según lo que necesitás, buscamos quién puede ayudarte.' },
  { title: 'Te respondemos para ayudarte con el siguiente paso.', description: 'Seguimos la conversación por el canal que elegiste.' },
]

export function ContactPage() {
  const reducedMotion = useReducedMotion()
  const entrance = {
    initial: reducedMotion ? false as const : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reducedMotion ? 0 : 0.7, delay: 0, ease },
  }

  return (
    <div className="relative isolate bg-avala-ink text-avala-paper [overflow-x:clip]">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_60%)]" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,rgba(47,184,255,0.16),transparent_65%)] blur-2xl"
      />

      <section className="page-container pt-10 pb-16 lg:pt-16 lg:pb-24">
        <SectionLabel index="(C)" label="Contacto" meta={companyInfo.hours} />

        <h1 className="display-tight pt-12 text-title-page text-avala-paper lg:pt-16">
          <SplitReveal text="Hablemos." stagger={0.018} play />{' '}
          <SplitReveal text="¿En qué podemos ayudarte?" stagger={0.018} delay={0.25} play className="text-avala-neon" />
        </h1>

        <motion.div
          className="mt-12 grid gap-8 border-t border-avala-paper/15 pt-8 lg:grid-cols-12"
          {...entrance}
        >
          <p className="text-base leading-7 text-avala-paper/70 lg:col-span-6 lg:text-lg lg:leading-8">
            Contanos qué necesitás: conocer nuestros servicios, consultar sobre tu eSIM, trabajar con nosotros o conversar sobre una idea.
          </p>
          <div className="hud-label flex flex-col gap-3 lg:col-span-5 lg:col-start-8 lg:items-end">
            <p className="flex items-center gap-3 text-avala-paper">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-avala-neon opacity-75" />
                <span className="relative size-2 rounded-full bg-avala-neon" />
              </span>
              Respuesta en menos de 24 h hábiles
            </p>
            <p>
              <LocalClock />
            </p>
          </div>
        </motion.div>
      </section>

      <section className="page-container grid gap-16 pb-24 lg:grid-cols-12 lg:gap-12 lg:pb-32">
        <motion.div {...entrance} className="lg:col-span-7">
          <ContactForm />
        </motion.div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="hud-label text-avala-paper">Qué pasa después</p>
            <ol className="mt-6 border-t border-avala-paper/15">
              {nextSteps.map((step, i) => (
                <motion.li
                  key={step.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-avala-paper/15 py-5"
                  {...entrance}
                  transition={{ ...entrance.transition, delay: reducedMotion ? 0 : i * 0.08 }}
                >
                  <span className="hud-label tabular pt-1 text-avala-neon">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="display-tight text-xl tracking-[-0.03em] text-avala-paper">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-avala-paper/60">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          <motion.div {...entrance} className="border border-avala-paper/15 p-6">
            <p className="hud-label text-avala-paper">¿Querés estimar un proyecto de software?</p>
            <p className="mt-3 text-sm leading-6 text-avala-paper/60">
              Obtené un rango de inversión para tu proyecto de software con el estimador.
            </p>
            <CtaLink to="/estimar-proyecto" variant="line" cursor="Estimar" className="mt-6 w-full">
              Estimar mi proyecto
            </CtaLink>
          </motion.div>
        </aside>
      </section>

      <section className="page-container pb-24 lg:pb-32">
        <SectionLabel index="(D)" label="Canales directos" meta={companyInfo.address} />
        <ContactChannelList className="mt-10" />
      </section>
    </div>
  )
}
