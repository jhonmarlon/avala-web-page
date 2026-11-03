import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  surface?: 'default' | 'ink'
}

export function Card({ className, children, surface = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        surface === 'ink'
          ? 'rounded-lg border border-avala-paper/15 bg-avala-ink-2 p-5 text-avala-paper sm:p-6'
          : 'panel-surface p-8 transition-transform duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
