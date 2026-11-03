import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type CtaLinkProps = {
  children: string
  variant?: 'solid' | 'line' | 'bare'
  className?: string
  cursor?: string
  onClick?: () => void
} & ({ to: string; href?: never } | { href: string; to?: never })

const variants = {
  solid: 'bg-avala-neon text-avala-ink hover:bg-avala-paper',
  line: 'border border-avala-paper/25 text-avala-paper hover:border-avala-paper',
  bare: 'px-0 text-avala-paper',
}

// Enlace de acción con rodillo de texto: la etiqueta sube y entra una copia desde abajo
export function CtaLink({ to, href, children, variant = 'solid', className, cursor, onClick }: CtaLinkProps) {
  const props = {
    onClick,
    'data-cursor': cursor,
    className: cn(
      'group inline-flex h-12 items-center justify-between gap-6 px-5 font-mono text-[0.75rem] leading-normal font-medium uppercase tracking-[0.14em] transition-colors duration-300',
      variants[variant],
      className,
    ),
  }
  const content = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-safe:group-hover:-translate-y-full motion-reduce:translate-y-0 motion-reduce:transition-none">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-safe:group-hover:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      </span>
      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 motion-safe:group-hover:rotate-45 motion-reduce:rotate-0 motion-reduce:transition-none" strokeWidth={1.5} />
    </>
  )
  return href !== undefined
    ? <a {...props} href={href}>{content}</a>
    : <Link {...props} to={to}>{content}</Link>
}
