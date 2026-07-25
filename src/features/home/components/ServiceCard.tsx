import { ArrowRight, type LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { subtleHover } from '@/lib/motion'

type ServiceCardProps = {
  title: string
  description: string
  ctaLabel: string
  Icon: LucideIcon
  featured?: boolean
}

export function ServiceCard({ title, description, ctaLabel, Icon, featured = false }: ServiceCardProps) {
  return (
    <motion.div {...subtleHover} className="h-full">
      <Card
        className={[
          'group h-full rounded-[1.35rem] p-4 shadow-[0_16px_45px_rgba(7,18,38,0.08)] lg:p-5',
          featured
            ? 'border-brand-400/40 bg-[linear-gradient(180deg,rgba(239,247,255,0.95),rgba(255,255,255,1))]'
            : 'border-[#dfe8f6] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(247,250,255,0.95))]',
        ].join(' ')}
      >
        <div className="flex h-full flex-col gap-4">
          <div className="flex size-13 items-center justify-center rounded-[1rem] bg-[radial-gradient(circle_at_center,rgba(43,179,255,0.14),rgba(255,255,255,0.98))] text-brand-500 ring-1 ring-brand-500/12 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(43,179,255,0.14)]">
            <Icon className="size-6.5" strokeWidth={1.8} />
          </div>

          <div className="space-y-2">
            <h3 className="max-w-[13ch] text-[1.15rem] leading-[1.2] font-semibold tracking-tight text-[#16213d] lg:text-[1.22rem]">
              {title}
            </h3>
            <p className="text-[0.92rem] leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#2a55ff]">
            <span>{ctaLabel}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
