import { motion } from 'motion/react'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { ProcessStepCard } from '@/features/home/components/ProcessStepCard'
import { processIntro, processSteps } from '@/features/home/data/content'
import { fadeUp, staggerContainer } from '@/lib/motion'
import background2 from '@/assets/background_2.png'

export function ProcessSection() {
  return (
    <Section
      className="py-18 text-white lg:py-24"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(4, 11, 30, 0.58) 0%, rgba(5, 17, 44, 0.56) 100%), url(${background2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="space-y-12">
        <Reveal>
          <Heading
            title={processIntro.title}
            showAccentLine
            className="max-w-3xl [&_h2]:text-[2.35rem] [&_h2]:text-white [&_h2]:leading-[1.1] [&_h2]:after:bg-brand-400"
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
