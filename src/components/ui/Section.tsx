import type { HTMLAttributes, ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  containerClassName?: string
  innerClassName?: string
  as?: 'section' | 'div'
}

export function Section({
  className,
  children,
  containerClassName,
  innerClassName,
  as = 'section',
  ...props
}: SectionProps) {
  const Component = as

  return (
    <Component className={cn('section-spacing', className)} {...props}>
      <Container className={containerClassName}>
        <div className={innerClassName}>{children}</div>
      </Container>
    </Component>
  )
}
