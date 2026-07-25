import { motion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { subtleHover } from '@/lib/motion'

type SuccessCaseCardProps = {
  title: string
  description: string
  metric: string
  metricLabel: string
}

export function SuccessCaseCard({ title, description, metric, metricLabel }: SuccessCaseCardProps) {
  return (
    <motion.div {...subtleHover} className="h-full">
      <Card className="h-full overflow-hidden p-0">
        <div className="h-44 bg-[radial-gradient(circle_at_top_left,rgba(43,179,255,0.35),transparent_40%),linear-gradient(135deg,#0a162d_0%,#0f2745_45%,#102f57_100%)] sm:h-48" />

        <div className="space-y-5 p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="text-sm leading-7 text-body-muted">{description}</p>
          </div>

          <div className="space-y-1 border-t border-border pt-5">
            <p className="text-3xl font-semibold tracking-tight text-brand-700">{metric}</p>
            <p className="text-sm leading-6 text-body-muted">{metricLabel}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
