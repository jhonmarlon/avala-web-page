import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProcessStepCardProps = {
  step: string
  title: string
  description: string
  Icon: LucideIcon
  isLast?: boolean
  accentClass?: string
}

export function ProcessStepCard({ step, title, description, Icon, isLast = false, accentClass }: ProcessStepCardProps) {
  return (
    <div className="group relative flex flex-col items-center text-center">
      {!isLast ? (
        <div className="absolute left-[calc(50%+2.4rem)] top-9 hidden h-px w-[calc(100%-4.8rem)] bg-[linear-gradient(90deg,rgba(43,179,255,0.85),rgba(132,87,255,0.5),rgba(43,179,255,0.08))] xl:block" />
      ) : null}

      <div
        className={cn(
          'relative z-10 flex size-[4.8rem] items-center justify-center rounded-full border bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] backdrop-blur-sm transition-all duration-300 group-hover:scale-105',
          accentClass,
        )}
      >
        <Icon className="size-8" />
      </div>

      <div className="mt-5 space-y-2.5">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-200">{step}</p>
        <h3 className="text-[1.35rem] font-semibold text-white">{title}</h3>
        <p className="mx-auto max-w-56 text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </div>
  )
}
