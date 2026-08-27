import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { finalCtaContent } from '@/features/home/data/content'
import { subtleHover } from '@/lib/motion'

export function FinalCTASection() {
  return (
    <Section withSpacing={false} className="bg-[linear-gradient(180deg,#f7fbff_0%,#eef5ff_100%)] px-0 pt-1 pb-7 lg:pt-2 lg:pb-8">
      <Reveal>
        <div className="px-4 text-center sm:px-6">
          <div className="mx-auto max-w-4xl space-y-2">
            <Heading
              align="center"
              title={finalCtaContent.title}
              description={finalCtaContent.description}
              className="[&_h2]:text-[2rem] [&_h2]:leading-[1.05] [&_h2]:text-[#0d1730] [&_p]:mx-auto [&_p]:max-w-2xl [&_p]:text-[0.95rem] [&_p]:leading-6 [&_p]:text-[#22324f] lg:[&_h2]:text-[2.35rem]"
            />

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <motion.div {...subtleHover}>
                <Button
                  to={finalCtaContent.primaryCta.to}
                  size="lg"
                  className="min-w-[12rem] border-[#d6a33e] bg-[linear-gradient(180deg,#15284b_0%,#0a1830_100%)] text-white shadow-[0_18px_35px_rgba(10,24,48,0.24)] hover:border-[#efc160] hover:bg-[linear-gradient(180deg,#1a3158_0%,#0d1f3b_100%)]"
                >
                  {finalCtaContent.primaryCta.label}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>

              <motion.div {...subtleHover}>
                <Button
                  to={finalCtaContent.secondaryCta.to}
                  variant="ghost"
                  className="min-w-[12rem] rounded-[0.95rem] border border-brand-200/80 bg-white/70 px-5 py-3 text-brand-700 shadow-[0_10px_24px_rgba(18,152,255,0.08)] backdrop-blur-sm hover:border-brand-300 hover:bg-white hover:text-brand-500"
                >
                  {finalCtaContent.secondaryCta.label}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
