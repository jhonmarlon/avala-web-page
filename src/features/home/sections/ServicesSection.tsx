import { motion } from 'motion/react'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { ServiceCard } from '@/features/home/components/ServiceCard'
import { services, servicesIntro } from '@/features/home/data/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function ServicesSection() {
  return (
    <Section withSpacing={false} className="pt-3 pb-16 lg:pt-4 lg:pb-20">
      <div className="space-y-10">
        <Reveal>
          <Heading
            title={servicesIntro.title}
            description="Ofrecemos un portafolio integral de servicios tecnológicos para acompañar a tu empresa en cada etapa de su transformación digital."
            showAccentLine
            className="max-w-4xl [&_h2]:text-[2.35rem] [&_h2]:leading-[1.1] [&_p]:max-w-2xl [&_p]:pt-1"
          />
        </Reveal>

        <motion.div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
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
