import type { ReactNode } from 'react'
import {
  motion,
  type HTMLMotionProps,
  type Variants,
} from 'motion/react'

import { cn } from '@/lib/utils'
import { fadeUp } from '@/lib/motion'

type RevealProps = Omit<
  HTMLMotionProps<'div'>,
  'children' | 'variants'
> & {
  children: ReactNode
  variants?: Variants
  delay?: number
}

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay,
  transition,
  ...props
}: RevealProps) {
  return (
    <motion.div
      {...props}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        ...transition,
        ...(delay !== undefined ? { delay } : {}),
      }}
    >
      {children}
    </motion.div>
  )
}