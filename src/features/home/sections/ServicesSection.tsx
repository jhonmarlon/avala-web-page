import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { services, servicesIntro } from '@/features/home/data/content'

const ease = [0.76, 0, 0.24, 1] as const

export function ServicesSection() {
  const rootRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start end', 'end start'] })
  const bigX = useTransform(scrollYProgress, [0, 1], ['5%', '-45%'])

  // Tarjeta flotante que sigue al cursor dentro de la lista
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const cardX = useSpring(px, { stiffness: 220, damping: 26 })
  const cardY = useSpring(py, { stiffness: 220, damping: 26 })

  const current = active !== null ? services[active] : null

  // Subtract the watermark's flow height minus its existing negative margin
  // from the top half-gap; never pull the decoration above the section edge.
  return (
    <section id="home-services" ref={rootRef} className="scroll-mt-24 relative overflow-hidden pt-[max(0px,calc(4.5rem-clamp(4rem,10vw,9rem)))] pb-6 lg:pt-[max(0px,calc(8.5rem-clamp(4rem,10vw,9rem)))] lg:pb-10">
      <motion.p
        aria-hidden="true"
        className="display-tight text-outline pointer-events-none whitespace-nowrap text-[clamp(4rem,10vw,9rem)] leading-none [--stroke-w:1px] [--stroke-c:rgba(238,242,255,0.12)]"
        style={{ x: bigX }}
      >
        Qué hacemos — Qué hacemos — Qué hacemos —
      </motion.p>

      <div className="page-container -mt-12 lg:-mt-24">
        <SectionLabel
          index="(03)"
          label={servicesIntro.title}
          meta={`${String(services.length).padStart(2, '0')} líneas de servicio`}
        />

        <ul
          ref={listRef}
          className="relative"
          onPointerMove={(event) => {
            const rect = listRef.current?.getBoundingClientRect()
            if (!rect) return
            px.set(event.clientX - rect.left)
            py.set(event.clientY - rect.top)
          }}
          onPointerLeave={() => setActive(null)}
        >
          {services.map((service, i) => (
            <motion.li
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease, delay: (i % 3) * 0.05 }}
              onPointerEnter={() => setActive(i)}
            >
              <Link
                to="/soluciones"
                data-cursor="Ver"
                className="group relative isolate grid grid-cols-[3rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-avala-paper/15 px-4 py-4 sm:grid-cols-[4rem_1fr_auto] lg:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1fr)_3rem] lg:px-6 lg:py-5"
              >
                {/* Relleno que sube desde la base */}
                <span className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-avala-neon transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />

                <span className="hud-label tabular transition-colors duration-500 group-hover:text-avala-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="display-tight relative block overflow-hidden text-[clamp(1.25rem,2.1vw,1.875rem)] leading-[1.15] text-avala-paper transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-avala-ink">
                  {service.title}
                </span>

                <span className="hidden text-sm leading-6 text-avala-paper/55 transition-colors duration-500 group-hover:text-avala-ink/80 lg:block">
                  {service.description}
                </span>

                <ArrowUpRight
                  className="size-6 justify-self-end text-avala-paper/60 transition-all duration-500 group-hover:rotate-45 group-hover:text-avala-ink"
                  strokeWidth={1.25}
                />
              </Link>
            </motion.li>
          ))}

          {/* Previsualización flotante (solo con puntero fino) */}
          <motion.li
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)]:lg:block"
            style={{ x: cardX, y: cardY }}
          >
            <AnimatePresence>
              {current && (
                <motion.div
                  key="card"
                  className="ml-8 -mt-24 w-64 border border-avala-paper/20 bg-avala-ink p-5"
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotate: 4 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="hud-label flex justify-between">
                    <span className="tabular text-avala-neon">S—{String((active ?? 0) + 1).padStart(2, '0')}</span>
                    <span>Servicio</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="pt-10"
                    >
                      <current.Icon className="size-12 text-avala-paper" strokeWidth={1} />
                      <p className="mt-6 text-sm leading-6 text-avala-paper/75">{current.description}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        </ul>
        <SectionContinue targetId="home-process" />
      </div>
    </section>
  )
}
