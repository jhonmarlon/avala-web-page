import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { isTouchDevice } from '@/lib/smooth-scroll'

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label'

// Cursor tipo visor: punto + anillo que se expande y muestra una etiqueta
// sobre cualquier elemento con data-cursor="Texto"
export function Cursor() {
  const [enabled] = useState(() => !isTouchDevice())
  const [label, setLabel] = useState<string | null>(null)
  const [overLink, setOverLink] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      const target = event.target instanceof Element ? event.target : null
      setLabel(target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null)
      setOverLink(!!target?.closest(interactiveSelector))
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const leave = () => setVisible(false)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('mouseleave', leave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('mouseleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const ringSize = label ? 92 : overLink ? 58 : 34

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-avala-neon"
          animate={{ width: 6, height: 6, opacity: visible && !label ? 1 : 0 }}
        />
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-avala-neon/70"
          animate={{
            width: ringSize,
            height: ringSize,
            scale: pressed ? 0.82 : 1,
            opacity: visible ? 1 : 0,
            backgroundColor: label ? 'rgba(47,184,255,1)' : 'rgba(47,184,255,0)',
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          {label && (
            <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-avala-ink">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
