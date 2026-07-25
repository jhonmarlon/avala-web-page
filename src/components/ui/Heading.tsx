import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  showAccentLine?: boolean
  children?: ReactNode
}

export function Heading({
  className,
  eyebrow,
  title,
  description,
  align = 'left',
  showAccentLine = false,
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
        <h2
          className={cn(
            'text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl',
            showAccentLine && 'relative pb-4 after:absolute after:left-0 after:bottom-0 after:h-1 after:w-18 after:rounded-full after:bg-brand-500',
            showAccentLine && align === 'center' && 'after:left-1/2 after:-translate-x-1/2',
          )}
        >
          {title}
        </h2>

        {description ? (
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
        ) : null}
      </div>

      {children}
    </div>
  )
}
