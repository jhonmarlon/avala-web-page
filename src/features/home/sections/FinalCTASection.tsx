import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { CtaLink } from '@/components/fx/CtaLink'
import { Magnetic } from '@/components/fx/Magnetic'
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
    <section ref={ref} className="relative overflow-hidden pt-24 pb-16 lg:pt-40">
      <div className="page-container">
        <SectionLabel index="(07)" label="Contacto" meta={companyInfo.hours} />

        <motion.h2
          className="display-tight origin-top-left pt-12 text-[clamp(3.2rem,11vw,11rem)] leading-[0.86] text-avala-paper lg:pt-20"
          style={{ scale }}
        >
          <SplitReveal text={finalCtaContent.title} stagger={0.018} />
        </motion.h2>

        <motion.div className="mt-12 h-px origin-left bg-avala-neon" style={{ scaleX: lineScale }} />

        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:items-center">
          <p className="text-base leading-7 text-avala-paper/70 lg:col-span-5 lg:text-lg lg:leading-8">
            {finalCtaContent.description}
          </p>

          <div className="flex flex-col items-start gap-10 lg:col-span-6 lg:col-start-7 lg:flex-row lg:items-center lg:justify-end">
            <Magnetic strength={0.4}>
              <Link
                to={finalCtaContent.primaryCta.to}
                data-cursor="Agendar"
                className="group flex size-44 items-center justify-center rounded-full bg-avala-neon text-center font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-avala-ink transition-colors duration-500 hover:bg-avala-paper sm:size-52"
              >
                <span className="transition-transform duration-500 group-hover:scale-110">
                  {finalCtaContent.primaryCta.label}
                </span>
              </Link>
            </Magnetic>
            <CtaLink to={finalCtaContent.secondaryCta.to} variant="line" cursor="Estimar">
              {finalCtaContent.secondaryCta.label}
            </CtaLink>
          </div>
        </div>

        <ContactChannelList className="mt-20" />
      </div>
    </section>
  )
}
