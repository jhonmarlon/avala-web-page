import { cva, type VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'border-brand-500 bg-brand-500 px-5 py-3 text-white shadow-glow hover:border-brand-400 hover:bg-brand-400',
        secondary:
          'border-slate-300 bg-white px-5 py-3 text-slate-900 hover:border-brand-400 hover:text-brand-700',
        ghost: 'border-transparent bg-transparent px-0 py-0 text-brand-700 hover:text-brand-500',
      },
      size: {
        md: 'min-h-11',
        lg: 'min-h-12 px-6 py-3.5 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type CommonProps = {
  className?: string
  children: ReactNode
}

type ButtonAsButtonProps = CommonProps &
  ButtonVariantProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
    to?: undefined
  }

type ButtonAsLinkProps = CommonProps &
  ButtonVariantProps &
  Omit<LinkProps, 'className'> & {
    to: LinkProps['to']
    href?: undefined
  }

type ButtonAsAnchorProps = CommonProps &
  ButtonVariantProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    to?: undefined
  }

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsAnchorProps

export function Button(props: ButtonProps) {
  const { className, variant, size, fullWidth, children } = props
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className)

  if ('to' in props && props.to !== undefined) {
    const { to, replace, state, preventScrollReset, relative, viewTransition } = props

    return (
      <Link
        className={classes}
        to={to}
        replace={replace}
        state={state}
        preventScrollReset={preventScrollReset}
        relative={relative}
        viewTransition={viewTransition}
      >
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href, target, rel, ...anchorProps } = props

    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={target === '_blank' ? rel ?? 'noreferrer noopener' : rel}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = props

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  )
}
