import { ArrowRight, CheckCircle2 } from 'lucide-react'
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
    <Section className="bg-[radial-gradient(circle_at_top_right,rgba(43,179,255,0.08),transparent_24%),linear-gradient(180deg,#f6faff_0%,#edf4ff_100%)] py-14 lg:py-18">
      <div className="space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Heading
              title={successCasesIntro.title}
              showAccentLine
              className="max-w-3xl [&_h2]:text-[2.35rem] [&_h2]:leading-[1.1]"
            />
          </Reveal>

          <motion.div {...subtleHover}>
            <Button to="/casos-de-exito" variant="ghost" className="justify-start lg:justify-end">
              Ver todos los casos
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </div>

        <div className="grid gap-4">
          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
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

        </div>
         <Reveal variants={fadeLeft}>
            <Card className="flex h-full flex-col justify-between gap-8 rounded-[1.8rem] border-[#d8e4f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-7 shadow-[0_24px_60px_rgba(8,20,39,0.1)] lg:p-8 xl:sticky xl:top-28">
              <Heading
                eyebrow={successCasesAside.eyebrow}
                title={successCasesAside.title}
                description={successCasesAside.description}
                className="[&_h2]:text-[2rem] [&_h2]:leading-[1.15]"
              />

              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>{successCasesAside.descriptionSecondary}</p>
                <div className="space-y-3 pt-1">
                  {successCasesAside.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <motion.div {...subtleHover} className="self-start">
                  <Button to={successCasesAside.ctaTo} variant="secondary" className="self-start">
                    {successCasesAside.ctaLabel}
                  </Button>
                </motion.div>
              </div>
          
            </Card>
          </Reveal>
      </div>
    </Section>
  )
}
