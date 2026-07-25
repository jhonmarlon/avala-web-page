import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SuccessCaseCard } from '@/features/home/components/SuccessCaseCard'
import {
  successCases,
  successCasesAside,
  successCasesIntro,
} from '@/features/home/data/content'
import { fadeLeft, fadeUp, staggerContainer, subtleHover } from '@/lib/motion'

export function SuccessCasesSection() {
  return (
    <Section>
      <div className="space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Heading
              eyebrow={successCasesIntro.eyebrow}
              title={successCasesIntro.title}
              description={successCasesIntro.description}
              className="max-w-3xl"
            />
          </Reveal>

          <motion.div {...subtleHover}>
            <Button to="/casos-de-exito" variant="ghost" className="justify-start lg:justify-end">
              Ver todos los casos
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {successCases.map((successCase) => (
              <motion.div key={successCase.title} variants={fadeUp} className="h-full">
                <SuccessCaseCard {...successCase} />
              </motion.div>
            ))}
          </motion.div>

          <Reveal variants={fadeLeft}>
            <Card className="flex h-full flex-col justify-between gap-8 p-8 lg:p-10 xl:sticky xl:top-28">
              <Heading
                eyebrow={successCasesAside.eyebrow}
                title={successCasesAside.title}
                description={successCasesAside.description}
              />

              <motion.div {...subtleHover} className="self-start">
                <Button to={successCasesAside.ctaTo} variant="secondary" className="self-start">
                  {successCasesAside.ctaLabel}
                </Button>
              </motion.div>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
