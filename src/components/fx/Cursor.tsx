import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'
import { isTouchDevice } from '@/lib/smooth-scroll'

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 180, damping: 24 })
  const ringY = useSpring(y, { stiffness: 180, damping: 24 })
  const opacity = useMotionValue(0)

  useEffect(() => {
    const root = document.documentElement
    const touch = window.matchMedia('(hover: none), (pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let active = false

    const hide = () => {
      active = false
      opacity.set(0)
      root.classList.remove('has-cursor')
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || isTouchDevice() || reducedMotion.matches) {
        hide()
        return
      }

      x.set(event.clientX)
      y.set(event.clientY)
      if (!active) {
        // Evita que el círculo viaje desde fuera de pantalla al entrar de nuevo.
        ringX.jump(event.clientX)
        ringY.jump(event.clientY)
      }
      active = true
      opacity.set(1)
      root.classList.add('has-cursor')
    }
    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') hide()
    }

    // Limpia también cualquier clase obsoleta tras una actualización en caliente.
    hide()
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', pointerDown)
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    touch.addEventListener('change', hide)
    reducedMotion.addEventListener('change', hide)
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', pointerDown)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      touch.removeEventListener('change', hide)
      reducedMotion.removeEventListener('change', hide)
    }
  }, [x, y, ringX, ringY, opacity])

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x: ringX, y: ringY, opacity }}
      >
        <div className="size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-avala-neon/40" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y, opacity }}
      >
        <div className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-avala-neon" />
      </motion.div>
    </>
  )
}
