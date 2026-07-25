import { ArrowRight, Bot, Cable, Cloud, Cpu } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { heroContent } from '@/features/home/data/content'
import { fadeLeft, fadeUp, staggerContainer, subtleHover } from '@/lib/motion'
import heroImage from '@/assets/hero.png'

const capabilityCards = [
  { label: 'Automatización', Icon: Cpu },
  { label: 'Integraciones', Icon: Cable },
  { label: 'Cloud', Icon: Cloud },
  { label: 'IA aplicada', Icon: Bot },
]

export function HeroSection() {
  const highlightedTitle = heroContent.title.replace(
    heroContent.highlightedText,
    `__${heroContent.highlightedText}__`,
  )

  const titleParts = highlightedTitle.split('__')

  return (
    <Section className="pb-8 text-white lg:pb-14" containerClassName="pt-8 lg:pt-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.96fr] lg:items-center lg:gap-12">
        <Reveal className="max-w-3xl space-y-7 lg:space-y-8">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-xs font-medium text-brand-100 sm:text-sm">
              {heroContent.eyebrow}
            </span>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              {titleParts[0]}
              <span className="text-brand-400">{titleParts[1]}</span>
              {titleParts[2]}
            </h1>

            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {heroContent.description}
            </p>
          </div>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} {...subtleHover}>
              <Button to={heroContent.primaryCta.to} size="lg" className="sm:min-w-[13rem]">
                {heroContent.primaryCta.label}
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} {...subtleHover}>
              <Button
                to={heroContent.secondaryCta.to}
                variant="secondary"
                size="lg"
                className="sm:min-w-[15rem] border-white/15 bg-white/5 text-white hover:border-brand-400 hover:bg-white/10 hover:text-white"
              >
                {heroContent.secondaryCta.label}
              </Button>
            </motion.div>
          </motion.div>
        </Reveal>

        <Reveal className="relative" variants={fadeLeft}>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(43,179,255,0.3),transparent_55%)] blur-3xl" />

          <motion.div
            className="panel-dark-glass overflow-hidden p-4 sm:p-5 lg:p-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="mb-4 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,20,39,0.94),rgba(16,47,87,0.72))] p-3 sm:mb-5 sm:p-4">
              <img src={heroImage} alt="Visual de soluciones tecnológicas" className="mx-auto w-full max-w-[30rem] object-contain" />
            </div>

            <div className="mb-5 inline-flex rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-brand-100 uppercase">
              {heroContent.floatingBadge}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilityCards.map(({ label, Icon }, index) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={[
                    'rounded-[2rem] border border-white/10 bg-surface-950/55 p-5 sm:p-6',
                    index === 0 ? 'sm:translate-y-8' : '',
                    index === 1 ? 'sm:-translate-y-2' : '',
                    index === 2 ? 'sm:translate-y-2' : '',
                    index === 3 ? 'sm:-translate-y-8' : '',
                  ].join(' ')}
                >
                  <div className="space-y-8 sm:space-y-10">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/12 text-brand-300 ring-1 ring-brand-400/25">
                      <Icon className="size-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">{label}</p>
                      <p className="text-sm leading-7 text-slate-300">
                        Base preparada para traducir el mockup a bloques visuales reutilizables.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Reveal>
      </div>
    </Section>
  )
}
