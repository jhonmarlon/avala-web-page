import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type SectionLabelProps = {
  index: string
  label: string
  meta?: string
  className?: string
}

// Section label: a readable baseline with a sweep that pauses outside the viewport.
export function SectionLabel({ index, label, meta, className }: SectionLabelProps) {
  return (
    <div className={cn('relative pb-3', className)}>
      <div className="hud-label flex items-baseline justify-between gap-6">
        <p className="flex items-baseline gap-4">
          <span className="tabular text-sm text-avala-neon sm:text-base">{index}</span>
          <span className="section-label-title text-avala-paper">{label}</span>
        </p>
        {meta && <p className="hidden sm:block">{meta}</p>}
      </div>
      <motion.span
        aria-hidden="true"
        className="section-divider-baseline pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden bg-avala-paper/15"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 1 }}
      >
        <motion.span
          className="section-divider-shine"
          variants={{
            hidden: { '--divider-play-state': 'paused', transition: { duration: 0 } },
            visible: { '--divider-play-state': 'running', transition: { duration: 0 } },
          }}
        />
      </motion.span>
    </div>
  )
}
