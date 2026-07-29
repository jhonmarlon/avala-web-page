import type { HTMLAttributes, ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'
import { fadeUp } from '@/lib/motion'

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variants?: Variants
  delay?: number
}

export function Reveal({ children, className, variants = fadeUp, delay, ...props }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
