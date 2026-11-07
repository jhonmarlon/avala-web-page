import { useCallback, useRef, type Ref } from 'react'

type Entry = (node: Element, complete: () => void) => (() => void) | void

// Compose the forwarded ref's React 19 lifecycle with our own attachment cleanup.
function attachForwardedRef<T>(ref: Ref<T> | undefined, node: T) {
  if (typeof ref === 'function') {
    const cleanup = ref(node)
    return () => {
      if (typeof cleanup === 'function') cleanup()
      else ref(null)
    }
  }
  if (ref) {
    ref.current = node
    return () => { ref.current = null }
  }
}

// Ref churn is not a viewport exit: only IO may re-arm a consumed visit.
export function useMobileIconEntry<T extends Element>(onEntry?: Entry, forwardedRef?: Ref<T>) {
  const consumed = useRef(false)
  return useCallback((element: T | null) => {
    if (!element) return
    const node = element
    const releaseForwardedRef = attachForwardedRef(forwardedRef, node)
    let attached = true
    let observer: IntersectionObserver | undefined
    let visibility: MutationObserver | undefined
    let cancel: (() => void) | void
    let animationEnd: ((event: Event) => void) | undefined
    let revision = 0
    let inView = false
    const doc = node.ownerDocument ?? (typeof document !== 'undefined' ? document : undefined)
    const mobile = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(hover: none) and (pointer: coarse)') : undefined
    const motion = mobile ? window.matchMedia('(prefers-reduced-motion: no-preference)') : undefined
    const eligible = () => mobile?.matches && motion?.matches
    const unwatchVisibility = () => { visibility?.disconnect(); visibility = undefined }
    const clearAnimation = () => {
      if (animationEnd) node.removeEventListener('animationend', animationEnd)
      animationEnd = undefined
      node.removeAttribute('data-mobile-icon-entry')
    }
    const stopPlayback = () => {
      revision++
      const stop = cancel
      cancel = undefined
      stop?.()
      clearAnimation()
    }
    const tryEntry = () => {
      if (!attached || !inView || consumed.current || !eligible() || !node.isConnected) return
      // The preloader already owns this scroll-lock readiness marker.
      let visible = !doc?.documentElement.classList.contains('is-loading')
      visible &&= node.checkVisibility?.({ visibilityProperty: true }) !== false
      let opacity = 1
      for (let ancestor: Element | null = node; visible && ancestor; ancestor = ancestor.parentElement) {
        const style = window.getComputedStyle?.(ancestor)
        if (!style) continue
        opacity *= Number(style.opacity)
        visible = style.display !== 'none' && style.visibility !== 'hidden' && opacity >= 0.9
      }
      if (!visible) {
        // Only intersecting-but-hidden artwork watches its own ancestor attributes.
        if (!visibility && typeof MutationObserver !== 'undefined') {
          visibility = new MutationObserver(tryEntry)
          for (let ancestor: Element | null = node; ancestor; ancestor = ancestor.parentElement) {
            visibility.observe(ancestor, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] })
          }
          if (doc) visibility.observe(doc.documentElement, { attributes: true, attributeFilter: ['class'] })
        }
        return
      }
      consumed.current = true
      unwatchVisibility()
      const run = ++revision
      const complete = () => {
        if (!attached || revision !== run) return
        revision++
        cancel = undefined
        clearAnimation()
      }
      if (onEntry) {
        const stop = onEntry(node, complete)
        if (revision === run) cancel = stop
      } else {
        animationEnd = (event: Event) => {
          if (/^illustration-(?:main|flow-main)(?:-replay)?$/.test((event as AnimationEvent).animationName)) complete()
        }
        node.addEventListener('animationend', animationEnd)
        node.setAttribute('data-mobile-icon-entry', 'active')
      }
    }
    function sync() {
      if (!attached) return
      if (!eligible()) { stopPlayback(); unwatchVisibility(); return }
      if (!observer && typeof IntersectionObserver !== 'undefined') {
        const current = new IntersectionObserver(entries => {
          if (!attached || observer !== current || !node.isConnected) return
          for (const entry of entries) {
            if (entry.target !== node) continue
            inView = entry.isIntersecting && entry.intersectionRatio >= 0.5
            if (!entry.isIntersecting || entry.intersectionRatio === 0) {
              consumed.current = false
              stopPlayback()
            }
            if (!inView) unwatchVisibility()
            else tryEntry()
          }
        }, { threshold: [0, 0.5] })
        observer = current
        current.observe(node)
      }
      tryEntry()
    }
    if (mobile && motion && typeof IntersectionObserver !== 'undefined') {
      mobile.addEventListener('change', sync)
      motion.addEventListener('change', sync)
      sync()
    }
    return () => {
      if (!attached) return
      attached = false
      observer?.disconnect()
      unwatchVisibility()
      stopPlayback()
      mobile?.removeEventListener('change', sync)
      motion?.removeEventListener('change', sync)
      releaseForwardedRef?.()
    }
  }, [onEntry, forwardedRef])
}
