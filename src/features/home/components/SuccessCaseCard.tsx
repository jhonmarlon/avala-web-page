import { motion } from 'motion/react'
import { Card } from '@/components/ui/Card'
import { subtleHover } from '@/lib/motion'

type SuccessCaseCardProps = {
  title: string
  description: string
  metric: string
  metricLabel: string
  image: string
}

export function SuccessCaseCard({ title, description, metric, metricLabel, image }: SuccessCaseCardProps) {
  return (
    <motion.div {...subtleHover} className="h-full">
      <Card className="panel-light-elevated h-full overflow-hidden rounded-[1.55rem] p-0">
        <img src={image} alt={title} className="h-40 w-full border-b border-[#d8e4f4] object-cover sm:h-44" />

        <div className="space-y-5 p-5 lg:p-6">
          <div className="space-y-2.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground lg:text-[1.1rem]">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-1 border-t border-[#d8e4f4] pt-4">
            <p className="text-[1.9rem] font-semibold tracking-tight text-[#2e9f45]">{metric}</p>
            <p className="text-sm leading-6 text-muted-foreground">{metricLabel}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
