import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'

// Pilot only: keep the shared editorial CTA and all its consumers unchanged.
export function SubtleCtaLink() {
  return (
    <Link
      to="/contacto"
      data-cursor="Agendar"
      className="group hidden h-10 items-center justify-between gap-6 border border-avala-neon/70 px-5 font-mono text-[0.75rem] leading-normal font-medium uppercase tracking-[0.14em] text-avala-paper transition-colors duration-200 hover:border-avala-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-avala-neon lg:inline-flex"
    >
      <span>Agendá una reunión</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-focus-visible:translate-x-0.5 motion-safe:group-focus-visible:-translate-y-0.5 motion-reduce:transition-none"
        strokeWidth={1.5}
      />
    </Link>
  )
}
