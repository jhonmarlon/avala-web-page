import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  children?: ReactNode
}

export function Heading({
  className,
  eyebrow,
  title,
  description,
  align = 'left',
  children,
  ...props
}: HeadingProps) {
  return (
    <div
      className={cn(
        'space-y-4',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {description ? (
          <p className="max-w-3xl text-base leading-8 text-body-muted sm:text-lg">{description}</p>
        ) : null}
      </div>

      {children}
    </div>
  )
}
