import { motion, useMotionValue, useSpring } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MagneticProps = {
  children: ReactNode
  className?: string
  strength?: number
}

// El contenido se desplaza hacia el puntero cuando está cerca
export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 })

  return (
    <motion.div
      className={cn('inline-block', className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left - rect.width / 2) * strength)
        y.set((event.clientY - rect.top - rect.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
