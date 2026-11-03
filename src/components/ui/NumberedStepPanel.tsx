import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type NumberedStepPanelProps = {
  label: string
  number: number
  title: string
  description: string
  Icon: LucideIcon
  className?: string
}

export function NumberedStepPanel({ label, number, title, description, Icon, className }: NumberedStepPanelProps) {
  return (
    <article className={cn('relative flex shrink-0 flex-col gap-4 border-avala-paper/15 py-8', className, 'lg:border-l lg:px-8 lg:py-6')}>
      <div className="hud-label flex justify-between">
        <span className="tabular text-avala-neon">{label}</span>
        <Icon className="size-5 text-avala-paper/60" strokeWidth={1.25} />
      </div>

      <p
        aria-hidden="true"
        className="display-tight text-outline tabular -ml-[0.06em] my-2 text-[clamp(5rem,8vw,7rem)] leading-[0.8] [--stroke-w:2px] [--stroke-c:rgba(238,242,255,0.85)] [filter:drop-shadow(0_0_12px_rgba(47,184,255,0.35))]"
      >
        {String(number).padStart(2, '0')}
      </p>

      <div className="max-w-md space-y-4">
        <h3 className="display-tight text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] text-avala-paper">{title}</h3>
        <p className="text-base leading-7 text-avala-paper/65 sm:text-lg sm:leading-8">{description}</p>
      </div>
    </article>
  )
}
