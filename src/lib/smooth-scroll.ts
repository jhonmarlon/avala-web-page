import Lenis from 'lenis'

let lenis: Lenis | null = null
let rafId = 0
let locked = false

type ScrollTargetResolver = (target: Element) => number | undefined
let targetResolver: { resolve: ScrollTargetResolver } | null = null

// Only an active route frame may correct its own selector coordinates. Numbers
// remain document coordinates, and obsolete cleanup cannot clear a newer owner.
export function registerScrollTargetResolver(resolver: ScrollTargetResolver) {
  const registration = { resolve: resolver }
  targetResolver = registration
  return () => {
    if (targetResolver === registration) targetResolver = null
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return

  lenis = new Lenis({ duration: 0.65, smoothWheel: true })
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

// offset: px a restar al destino (p. ej. altura del header fijo); sin Lenis lo resuelve scroll-margin del CSS
export function scrollToTarget(target: string | number, offset = 0) {
  const reducedMotion = prefersReducedMotion()
  const node = typeof target === 'string' && targetResolver && !['top', 'left', 'start', '#', 'bottom', 'right', 'end'].includes(target)
    ? target.startsWith('#') ? document.getElementById(target.slice(1)) : document.querySelector(target)
    : null
  const correction = node ? targetResolver?.resolve(node) : undefined
  if (lenis && !reducedMotion) {
    // Keep the selector: Lenis applies CSS scroll-margin/padding itself, once.
    lenis.scrollTo(target, { duration: 1.6, offset: correction === undefined ? -offset : correction - offset })
    return
  }
  const behavior = reducedMotion ? 'instant' : 'smooth'
  if (typeof target === 'number') window.scrollTo({ top: target, behavior })
  else if (node && correction !== undefined) {
    const margin = Number.parseFloat(getComputedStyle(node).scrollMarginTop) || 0
    const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    // Native legacy ignores the caller offset and relies solely on CSS clearance.
    window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY + correction - margin - padding, behavior })
  } else document.querySelector(target)?.scrollIntoView({ behavior })
}
