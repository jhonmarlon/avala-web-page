import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { aboutSectionContent } from '@/features/home/data/content'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {children}&nbsp;
    </motion.span>
  )
}

export function ManifestoSection() {
  const textRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: textRef, offset: ['start 0.85', 'end 0.45'] })
  const words = aboutSectionContent.title.split(' ')

  return (
    <section id="manifiesto" className="page-container py-24 lg:py-40">
      <SectionLabel index="(01)" label={aboutSectionContent.eyebrow} meta="Quiénes somos" />

      <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:pt-20">
        <p
          ref={textRef}
          className="display-tight text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.02] text-avala-paper lg:col-span-11"
        >
          {words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
        </p>

        <div className="grid gap-10 border-t border-avala-paper/15 pt-10 lg:col-span-12 lg:grid-cols-12">
          <p className="text-base leading-7 text-avala-paper/70 lg:col-span-5 lg:text-lg lg:leading-8">
            {aboutSectionContent.description}
          </p>
          <ol className="lg:col-span-5 lg:col-start-7">
            {aboutSectionContent.highlights.map((item, i) => (
              <motion.li
                key={item}
                className="flex gap-6 border-b border-avala-paper/10 py-4 text-avala-paper/85"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
              >
                <span className="hud-label tabular pt-1 text-avala-neon">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </motion.li>
            ))}
            <li className="pt-8">
              <CtaLink to={aboutSectionContent.ctaTo} variant="line" cursor="Conocer">
                {aboutSectionContent.ctaLabel}
              </CtaLink>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
