import { motion } from 'motion/react'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { ServiceCard } from '@/features/home/components/ServiceCard'
import { services, servicesIntro } from '@/features/home/data/content'
import { fadeLeft, fadeUp, staggerContainer } from '@/lib/motion'

export function ServicesSection() {
  return (
    <Section className="pt-12 lg:pt-18">
      <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-8">
          <Reveal>
            <Heading
              eyebrow={servicesIntro.eyebrow}
              title={servicesIntro.title}
              description={servicesIntro.description}
              className="max-w-3xl"
            />
          </Reveal>

          <Reveal variants={fadeLeft}>
            <p className="max-w-xl text-sm leading-7 text-body-muted lg:justify-self-end lg:pb-2">
              Vamos a usar esta base para mantener consistencia visual y a la vez permitir que el
              contenido de cada solución evolucione sin rehacer la UI entera.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={fadeUp} className="h-full">
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
