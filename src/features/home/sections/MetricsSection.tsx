import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { metrics } from '@/features/home/data/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function MetricsSection() {
  return (
    <Section className="-mt-4 py-0 lg:-mt-10" containerClassName="relative z-10">
      <Reveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <Card className="grid gap-5 p-5 sm:p-6 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-4 lg:gap-0 lg:p-8">
            {metrics.map(({ value, label, Icon }, index) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={[
                  'flex items-center gap-4 rounded-[1.75rem] sm:gap-5 lg:px-6',
                  index !== metrics.length - 1 ? 'lg:border-r lg:border-border' : '',
                ].join(' ')}
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-700 ring-1 ring-brand-500/15 sm:size-16">
                  <Icon className="size-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
                  <p className="max-w-40 text-sm leading-6 text-body-muted">{label}</p>
                </div>
              </motion.div>
            ))}
          </Card>
        </motion.div>
      </Reveal>
    </Section>
  )
}
