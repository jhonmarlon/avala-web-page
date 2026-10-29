import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type SplitRevealProps = {
  text: string
  className?: string
  charClassName?: string
  delay?: number
  stagger?: number
  // Si se define, controla la animación externamente (p. ej. tras el preloader)
  play?: boolean
}

const ease = [0.76, 0, 0.24, 1] as const
// Lo bastante abajo para que ningún trazo asome por el margen inferior de la máscara
const HIDDEN = { y: '140%' }
const SHOWN = { y: '0%' }

// Revela un texto carácter a carácter desde una máscara inferior
export function SplitReveal({ text, className, charClassName, delay = 0, stagger = 0.035, play }: SplitRevealProps) {
  // La visibilidad se mide en el contenedor: cada letra empieza oculta por su máscara,
  // así que observarlas una a una nunca las daría por visibles
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const visible = play ?? inView
  const words = text.split(' ')
  let index = 0

  return (
    <span ref={ref} className={cn('inline-block', className)} aria-label={text} role="text">
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const i = index++
            return (
              // Máscara solo vertical: con tracking negativo las letras redondas (s, o) desbordan
              // su caja en horizontal y overflow-hidden las recortaba, igual que al brillo neón
              <span key={i} className="inline-block overflow-x-visible overflow-y-clip py-[0.12em] -my-[0.12em] align-top">
                <motion.span
                  className={cn('inline-block will-change-transform', charClassName)}
                  initial={HIDDEN}
                  animate={visible ? SHOWN : HIDDEN}
                  transition={{ duration: 1.05, ease, delay: delay + i * stagger }}
                >
                  {char}
                </motion.span>
              </span>
            )
          })}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
