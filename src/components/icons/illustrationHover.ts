import type { PointerEvent } from 'react'

// Persist the phase on exit: only a real SVG entry changes the finite animation name.
export function replayIllustrationOnEnter(event: PointerEvent<SVGSVGElement>) {
  if (event.pointerType === 'touch') return
  for (const target of event.currentTarget.querySelectorAll<SVGGElement>('.illustration-gesture')) {
    target.dataset.illustrationReplay = target.dataset.illustrationReplay === 'replay' ? 'primary' : 'replay'
  }
}
