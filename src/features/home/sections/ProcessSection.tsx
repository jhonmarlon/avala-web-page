import { motion } from 'motion/react'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { ProcessStepCard } from '@/features/home/components/ProcessStepCard'
import { processIntro, processSteps } from '@/features/home/data/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function ProcessSection() {
  return (
    <Section className="bg-surface-950 py-18 text-white lg:py-24">
      <div className="space-y-12">
        <Reveal>
          <Heading
            eyebrow={processIntro.eyebrow}
            title={processIntro.title}
            description={processIntro.description}
            className="max-w-3xl [&>p:first-child]:text-brand-200 [&_h2]:text-white [&_p:last-child]:text-slate-300"
          />
        </Reveal>

        <motion.div
          className="grid gap-10 sm:grid-cols-2 xl:grid-cols-5 xl:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {processSteps.map((step, index) => (
            <motion.div key={step.step} variants={fadeUp}>
              <ProcessStepCard
                {...step}
                isLast={index === processSteps.length - 1}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
