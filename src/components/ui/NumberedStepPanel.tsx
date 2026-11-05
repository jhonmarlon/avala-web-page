import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type NumberedStepPanelProps = {
  label: string
  number: number
  title: string
  description: string
  Icon: LucideIcon
  className?: string
  /** Optional decorative scene beside the number; otherwise keep the original icon. */
  illustration?: ReactNode
  /** Opt-in phone row sizing; the default article presentation stays unchanged. */
  mobileCompact?: boolean
}

export function NumberedStepPanel({ label, number, title, description, Icon, illustration, className, mobileCompact = false }: NumberedStepPanelProps) {
  const stageNumber = (
    <p
      aria-hidden="true"
      className={cn('display-tight text-outline tabular -ml-[0.06em] my-2', mobileCompact ? 'text-[4rem]' : 'text-[clamp(5rem,8vw,7rem)]', 'leading-[0.8] [--stroke-w:2px] [--stroke-c:rgba(238,242,255,0.85)] [filter:drop-shadow(0_0_12px_rgba(47,184,255,0.35))]')}
    >
      {String(number).padStart(2, '0')}
    </p>
  )

  return (
    <article className={cn(mobileCompact ? 'relative flex shrink-0 flex-col gap-3 border-avala-paper/15 py-4' : 'relative flex shrink-0 flex-col gap-4 border-avala-paper/15 py-8', className, 'lg:border-l lg:px-8 lg:py-6', Boolean(illustration) && 'sequence-illustration-host')}>
      <div className="hud-label flex justify-between">
        <span className="tabular text-avala-neon">{label}</span>
        {!illustration && <Icon className="size-5 text-avala-paper/60" strokeWidth={1.25} />}
      </div>

      {illustration ? (
        <div className="sequence-number-visual flex items-center justify-between gap-6">
          {stageNumber}
          {illustration}
        </div>
      ) : stageNumber}

      <div className={mobileCompact ? 'max-w-md space-y-3' : 'max-w-md space-y-4'}>
        <h3 className={cn('display-tight', mobileCompact ? 'text-2xl' : 'text-[clamp(1.75rem,3vw,2.5rem)]', 'leading-[1.15] text-avala-paper')}>{title}</h3>
        <p className={mobileCompact ? 'text-base leading-6 text-avala-paper/65' : 'text-base leading-7 text-avala-paper/65 sm:text-lg sm:leading-8'}>{description}</p>
      </div>
    </article>
  )
}
