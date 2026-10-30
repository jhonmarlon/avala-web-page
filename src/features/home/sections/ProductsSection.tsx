import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SectionContinue } from '@/components/ui/SectionContinue'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { navigationItems } from '@/config/navigation'
import { EsimSchematic } from '@/features/home/components/EsimSchematic'
import { EstimatorPreview } from '@/features/home/components/EstimatorPreview'

const productVisuals: Record<string, ReactNode> = {
  '/esim': <EsimSchematic />,
  '/estimar-proyecto': <EstimatorPreview />,
}

const products = navigationItems
  .flatMap((item) => item.children ?? [])
  .filter((child) => child.href in productVisuals)

const corners = [
  'left-0 top-0 border-l border-t',
  'right-0 top-0 border-r border-t',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
]

export function ProductsSection() {
  return (
    <section id="home-products" className="scroll-mt-24 page-container home-section-spacing">
      <SectionLabel index="(06)" label="Productos" meta="Disponibles hoy" />

      <div className="mt-6 grid gap-4 lg:mt-0 lg:grid-cols-2 lg:gap-0">
        {products.map((product, i) => (
          <motion.div
            key={product.href}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="lg:border-avala-paper/15 lg:even:border-l"
          >
            <Link
              to={product.href}
              data-cursor="Abrir"
              className="group relative isolate flex h-full flex-col gap-8 overflow-hidden p-5 transition-colors duration-300 active:bg-avala-paper/[0.04] sm:p-8 lg:gap-12 lg:p-12"
              onPointerMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
                event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
              }}
            >
              {/* Retícula: siempre visible en móvil, foco que sigue al puntero en escritorio */}
              <span
                aria-hidden="true"
                className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_75%)] lg:opacity-0 lg:transition-opacity lg:duration-500 lg:[mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),black,transparent)] lg:group-hover:opacity-100"
              />

              {/* Esquinas de encuadre (en móvil reemplazan al borde completo) */}
              {corners.map((position) => (
                <span
                  key={position}
                  aria-hidden="true"
                  className={`absolute size-4 border-avala-neon transition-all duration-500 group-hover:size-6 group-active:size-6 lg:size-3 ${position}`}
                />
              ))}

              <div className="hud-label flex justify-between gap-4">
                <span className="tabular text-avala-neon">P—{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate font-mono normal-case tracking-normal text-avala-paper/40">avalagroup.net{product.href}</span>
              </div>

              <div className="flex-1">{productVisuals[product.href]}</div>

              <div className="space-y-4">
                <h3 className="display-tight flex items-start justify-between gap-6 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] text-avala-paper">
                  {product.label}
                  <span className="mt-1 flex size-11 shrink-0 items-center justify-center bg-avala-neon text-avala-ink transition-transform duration-500 group-hover:rotate-45 lg:size-14 lg:bg-transparent lg:text-avala-paper/40 lg:group-hover:text-avala-neon">
                    <ArrowUpRight className="size-5 lg:size-10" strokeWidth={1.25} />
                  </span>
                </h3>
                <p className="max-w-sm text-base leading-7 text-avala-paper/65 sm:text-lg sm:leading-8">{product.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <SectionContinue targetId="home-contact" />
    </section>
  )
}
