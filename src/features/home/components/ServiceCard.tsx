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
          'group h-full p-6 lg:p-7',
          featured ? 'border-brand-400/30 bg-brand-50/60' : 'bg-card',
        ].join(' ')}
      >
        <div className="flex h-full flex-col gap-6">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-700 ring-1 ring-brand-500/15 transition-transform duration-200 group-hover:scale-105">
            <Icon className="size-7" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="text-sm leading-7 text-body-muted">{description}</p>
          </div>

          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            <span>{ctaLabel}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
