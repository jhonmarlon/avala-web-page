import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'panel-surface p-8 transition-transform duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
