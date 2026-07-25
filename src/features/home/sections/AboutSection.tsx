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
    <Section className="bg-[linear-gradient(180deg,#edf4ff_0%,#f7fbff_100%)] py-12 lg:py-16">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Card className="overflow-hidden rounded-[1.8rem] border-white/10 p-0 shadow-[0_30px_80px_rgba(8,20,39,0.18)]">
            <motion.div
              className="relative h-full min-h-72 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(43,179,255,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(18,152,255,0.18),transparent_25%),linear-gradient(135deg,#081427_0%,#0b1d38_50%,#0f2c52_100%)] sm:min-h-80"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-x-8 bottom-8 rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-100">Tecnología aplicada</p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-200">
                  Soluciones diseñadas para conectar negocio, operación y crecimiento.
                </p>
              </div>
            </motion.div>
          </Card>
        </Reveal>

        <Reveal variants={fadeLeft}>
          <Card className="flex h-full flex-col justify-between gap-8 rounded-[1.8rem] border-[#d8e4f4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-7 shadow-[0_24px_60px_rgba(8,20,39,0.1)] lg:p-8">
            <Heading
              eyebrow={aboutSectionContent.eyebrow}
              title={aboutSectionContent.title}
              description={aboutSectionContent.description}
              className="[&_h2]:text-[2rem] [&_h2]:leading-[1.15]"
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
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-500" />
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
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
