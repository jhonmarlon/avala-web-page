import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { metrics } from '@/features/home/data/content'
import { fadeUp, staggerContainer } from '@/lib/motion'

export function MetricsSection() {
  return (
    <Section className="-mt-30 py-0 lg:-mt-34" containerClassName="relative z-30">
      <Reveal>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <Card className="overflow-hidden rounded-[2rem] border-[#d5e1f2] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-3 shadow-[0_28px_72px_rgba(8,20,39,0.18)] sm:px-5 sm:py-4 lg:rounded-[2rem] lg:px-6 lg:py-5">
            <div className="grid gap-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:grid-cols-4 lg:gap-0">
            {metrics.map(({ value, label, Icon }, index) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={[
                  'flex items-center gap-3 px-2 py-3 sm:gap-4 lg:px-5 lg:py-3',
                  index !== metrics.length - 1 ? 'lg:border-r lg:border-[#d8e3f2]' : '',
                ].join(' ')}
              >
                <div className="flex size-[4.15rem] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,#ffffff_0%,#eef5ff_100%)] text-[#2a73ff] ring-1 ring-[#d6e5ff] shadow-[0_18px_35px_rgba(43,179,255,0.16)] sm:size-[4.3rem]">
                  <Icon className="size-[1.6rem]" strokeWidth={1.7} />
                </div>

                <div className="space-y-1">
                  <p className="text-[2rem] font-extrabold tracking-tight text-[#0d1730]">{value}</p>
                  <p className="max-w-40 text-[0.92rem] leading-5 text-[#22324f]">{label}</p>
                </div>
              </motion.div>
            ))}
            </div>
          </Card>
        </motion.div>
      </Reveal>
    </Section>
  )
}
