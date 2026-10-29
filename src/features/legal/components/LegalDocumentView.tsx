import { motion } from 'motion/react'
import { CtaLink } from '@/components/fx/CtaLink'
import { SectionLabel } from '@/components/fx/SectionLabel'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { companyInfo } from '@/config/site'
import type { LegalDocument } from '@/features/legal/data/documents'
import { scrollToTarget } from '@/lib/smooth-scroll'

type LegalDocumentViewProps = {
  document: LegalDocument
  related: { to: string; label: string }
}

const ease = [0.76, 0, 0.24, 1] as const
const anchor = (i: number) => `seccion-${i + 1}`

// Documento legal: índice fijo a la izquierda (desktop) y secciones numeradas
export function LegalDocumentView({ document, related }: LegalDocumentViewProps) {
  return (
    <div className="relative isolate bg-avala-ink text-avala-paper [overflow-x:clip]">
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,black,transparent_40%)]" />

      <section className="page-container pt-10 pb-12 lg:pt-16 lg:pb-16">
        <SectionLabel index="(L)" label={document.label} meta={`Actualizado: ${document.updated}`} />

        <h1 className="display-tight pt-12 text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] text-avala-paper lg:pt-16">
          <SplitReveal text={document.title} stagger={0.012} play />
        </h1>

        <motion.p
          className="mt-10 max-w-3xl border-t border-avala-paper/15 pt-8 text-base leading-7 text-avala-paper/70 lg:text-lg lg:leading-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.4 }}
        >
          {document.intro}
        </motion.p>
        <p className="hud-label mt-6 sm:hidden">Actualizado: {document.updated}</p>
      </section>

      <section className="page-container grid gap-12 pb-24 lg:grid-cols-12 lg:pb-32">
        <nav aria-label="Contenido" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-28 space-y-2 border-l border-avala-paper/15 pl-5">
            {document.sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#${anchor(i)}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToTarget(`#${anchor(i)}`, 112)
                  }}
                  className="hud-label flex gap-3 py-1 transition-colors duration-300 hover:text-avala-paper"
                >
                  <span className="tabular text-avala-neon">{String(i + 1).padStart(2, '0')}</span>
                  <span className="normal-case tracking-normal">{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lg:col-span-8 lg:col-start-5">
          {document.sections.map((section, i) => (
            <article
              key={section.title}
              id={anchor(i)}
              className="scroll-mt-28 border-t border-avala-paper/15 py-10 first:border-t-0 first:pt-0"
            >
              <h2 className="display-tight flex items-baseline gap-4 text-[clamp(1.4rem,2.4vw,2rem)] leading-tight text-avala-paper">
                <span className="hud-label tabular text-avala-neon">{String(i + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="mt-5 space-y-4 text-[0.95rem] leading-7 text-avala-paper/70">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="grid grid-cols-[1.25rem_1fr]">
                        <span aria-hidden="true" className="mt-3 h-px w-2.5 bg-avala-neon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}

          <div className="mt-6 flex flex-col gap-3 border-t border-avala-paper/15 pt-10 sm:flex-row">
            <CtaLink to={related.to} variant="line" cursor="Leer">
              {related.label}
            </CtaLink>
            <CtaLink to="/contacto" variant="bare" cursor="Escribir">
              {`Dudas: ${companyInfo.email}`}
            </CtaLink>
          </div>
        </div>
      </section>
    </div>
  )
}
