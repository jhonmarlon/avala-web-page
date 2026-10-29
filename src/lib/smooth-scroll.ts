import Lenis from 'lenis'

let lenis: Lenis | null = null
let rafId = 0
let locked = false

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return

  lenis = new Lenis({ duration: 1.15, smoothWheel: true })
  if (locked) lenis.stop()

  const raf = (time: number) => {
    lenis?.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
}

export function stopSmoothScroll() {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  lenis = null
}

// Bloquea el scroll (p. ej. mientras corre el preloader)
export function setScrollLocked(value: boolean) {
  locked = value
  document.documentElement.classList.toggle('is-loading', value)
  if (value) lenis?.stop()
  else lenis?.start()
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}
