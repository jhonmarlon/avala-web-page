import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('page-container', className)} {...props}>
      {children}
    </div>
  )
}
