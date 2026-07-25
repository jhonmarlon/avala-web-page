import { CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { aboutSectionContent } from '@/features/home/data/content'
import { fadeLeft, fadeUp, staggerContainer, subtleHover } from '@/lib/motion'

export function AboutSection() {
  return (
    <Section className="pt-4 lg:pt-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Card className="overflow-hidden p-0">
            <motion.div
              className="h-full min-h-72 bg-[radial-gradient(circle_at_20%_20%,rgba(43,179,255,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(18,152,255,0.18),transparent_25%),linear-gradient(135deg,#081427_0%,#0b1d38_50%,#0f2c52_100%)] sm:min-h-80"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />
          </Card>
        </Reveal>

        <Reveal variants={fadeLeft}>
          <Card className="flex h-full flex-col justify-between gap-8 p-8 lg:p-10">
            <Heading
              eyebrow={aboutSectionContent.eyebrow}
              title={aboutSectionContent.title}
              description={aboutSectionContent.description}
            />

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {aboutSectionContent.highlights.map((item) => (
                <motion.div key={item} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-700" />
                  <p className="text-sm leading-7 text-body-muted">{item}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div {...subtleHover} className="self-start">
              <Button to={aboutSectionContent.ctaTo} variant="secondary" className="self-start">
                {aboutSectionContent.ctaLabel}
              </Button>
            </motion.div>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
