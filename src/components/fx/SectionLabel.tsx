import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type SectionLabelProps = {
  index: string
  label: string
  meta?: string
  className?: string
}

// Rótulo de sección: índice, nombre y metadato sobre una línea de 1px que se dibuja al entrar
export function SectionLabel({ index, label, meta, className }: SectionLabelProps) {
  return (
    <div className={cn('relative pb-3', className)}>
      <div className="hud-label flex items-baseline justify-between gap-6">
        <p className="flex gap-4">
          <span className="tabular text-avala-neon">{index}</span>
          <span className="text-avala-paper">{label}</span>
        </p>
        {meta && <p className="hidden sm:block">{meta}</p>}
      </div>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-avala-paper/15"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}
