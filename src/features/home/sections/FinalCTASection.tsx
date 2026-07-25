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
    <Section className="pt-0">
      <Reveal>
        <div className="panel-surface overflow-hidden px-8 py-10 text-center lg:px-14 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-6">
            <Heading
              align="center"
              title={finalCtaContent.title}
              description={finalCtaContent.description}
              className="[&_p]:mx-auto"
            />

            <div className="flex justify-center">
              <motion.div {...subtleHover}>
                <Button to={finalCtaContent.primaryCta.to} size="lg">
                  {finalCtaContent.primaryCta.label}
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
