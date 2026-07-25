import type { LucideIcon } from 'lucide-react'

type ProcessStepCardProps = {
  step: string
  title: string
  description: string
  Icon: LucideIcon
  isLast?: boolean
}

export function ProcessStepCard({ step, title, description, Icon, isLast = false }: ProcessStepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
      {!isLast ? (
        <div className="absolute left-[calc(50%+2.25rem)] top-9 hidden h-px w-[calc(100%-4.5rem)] bg-[linear-gradient(90deg,rgba(43,179,255,0.55),rgba(43,179,255,0.05))] lg:block" />
      ) : null}

      <div className="relative z-10 flex size-[4.5rem] items-center justify-center rounded-full border border-brand-400/35 bg-white/5 text-brand-300 shadow-glow backdrop-blur-sm">
        <Icon className="size-8" />
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-200">{step}</p>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="max-w-64 text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  )
}
