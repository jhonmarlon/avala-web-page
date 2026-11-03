import { cva, type VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ComponentPropsWithRef, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/lib/utils'

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-[1.05rem] border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:pointer-events-none disabled:opacity-60'

// Editorial actions retain their native focus and disabled behavior, without
// inheriting the rounded legacy family's geometry or interaction overrides.
const editorialBase = 'font-mono uppercase tracking-[0.14em] transition-colors duration-300'

const buttonVariants = cva(
  '',
  {
    variants: {
      variant: {
        primary:
          'border-[#d6a33e] bg-[linear-gradient(180deg,#ad7a1f_0%,#8e6012_100%)] px-5 py-3 text-white shadow-[0_18px_35px_rgba(173,122,31,0.24)] hover:border-[#efc160] hover:brightness-110',
        secondary:
          'border-white/18 bg-white/4 px-5 py-3 text-white hover:border-brand-400/50 hover:bg-white/8',
        ghost: 'border-transparent bg-transparent px-0 py-0 text-brand-700 hover:text-brand-500',
        outline:
          'rounded-sm border-avala-paper/25 bg-avala-ink px-4 py-3 text-avala-paper transition-colors hover:border-avala-neon/50 hover:bg-avala-neon/10 focus-visible:ring-avala-neon/60 motion-reduce:transition-none',
        neon:
          'rounded-none border-avala-neon bg-[var(--color-avala-neon)] bg-none px-5 py-3 text-base text-avala-ink shadow-none hover:border-avala-paper hover:bg-avala-paper hover:brightness-100 focus-visible:ring-avala-neon disabled:opacity-40 motion-reduce:transition-none',
        neonSecondary:
          'rounded-none border-avala-paper/25 bg-transparent px-5 py-3 text-base text-avala-paper shadow-none hover:border-avala-neon hover:text-avala-neon focus-visible:ring-avala-neon disabled:opacity-40 motion-reduce:transition-none',
        editorialSolid:
          'group inline-flex h-14 items-center justify-between gap-8 bg-avala-neon px-6 text-[0.75rem] font-medium text-avala-ink hover:bg-avala-paper disabled:cursor-wait disabled:opacity-70',
        editorialLine:
          'h-12 border border-avala-paper/25 px-5 text-[0.72rem] text-avala-paper hover:border-avala-paper',
        editorialBare:
          'h-12 px-5 text-[0.72rem] text-avala-mute hover:text-avala-paper',
      },
      size: {
        md: 'min-h-11',
        lg: 'min-h-[3.3rem] px-6 py-3.5 text-base',
        icon: 'size-11 shrink-0 p-0',
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
  ComponentPropsWithRef<'button'> & {
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
  const { className, variant, size, fullWidth, children, ...rest } = props
  const editorial = variant === 'editorialSolid' || variant === 'editorialLine' || variant === 'editorialBare'
  const classes = cn(editorial ? editorialBase : buttonBase, buttonVariants({ variant, size, fullWidth }), className)

  if ('to' in rest && rest.to !== undefined) {
    return (
      <Link {...rest} className={classes}>
        {children}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const { href, target, rel, ...anchorProps } = rest

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

  const { type = 'button', ...buttonProps } = rest

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  )
}
