import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { companyInfo } from '@/config/site'
import { ContactChannelList } from '@/features/contact/components/ContactChannelList'
import { finalCtaContent } from '@/features/home/data/content'

export function FinalCTASection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const lineScale = useTransform(scrollYProgress, [0.3, 1], [0, 1])

  return (
    <section id="home-contact" ref={ref} className="scroll-mt-24 relative overflow-hidden pt-6 pb-16 lg:pt-10">
      <div className="page-container">
        <SectionLabel index="(07)" label="Contacto" meta={companyInfo.hours} />

        <motion.h2
          className="display-tight max-w-[20ch] origin-top-left pt-8 text-[clamp(2rem,4vw,3.5rem)] leading-[1.15] text-avala-paper lg:pt-20"
          style={{ scale }}
        >
          <SplitReveal text={finalCtaContent.title} stagger={0.018} />
        </motion.h2>

        <motion.div className="mt-8 h-px origin-left lg:mt-12 bg-avala-neon" style={{ scaleX: lineScale }} />

        <div className="grid gap-8 pt-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pt-12">
          <p className="text-base leading-7 text-avala-paper/70 sm:text-lg sm:leading-8 lg:col-span-5">
            {finalCtaContent.description}
          </p>

          <div className="flex flex-wrap items-start gap-4 lg:col-span-7 lg:col-start-6 lg:items-center lg:justify-end">
            <CtaLink to={finalCtaContent.primaryCta.to} cursor="Agendar">
              {finalCtaContent.primaryCta.label}
            </CtaLink>
            <CtaLink to={finalCtaContent.secondaryCta.to} variant="line" cursor="Estimar">
              {finalCtaContent.secondaryCta.label}
            </CtaLink>
          </div>
        </div>

        <ContactChannelList className="mt-12 lg:mt-20" />
      </div>
    </section>
  )
}
