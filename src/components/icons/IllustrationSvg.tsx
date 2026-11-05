import type { SVGProps } from 'react'
import { replayIllustrationOnEnter } from './illustrationHover'

type IllustrationSvgProps = Omit<SVGProps<SVGSVGElement>, 'aria-hidden' | 'focusable' | 'onPointerEnter'> & {
  'aria-hidden'?: never
  focusable?: never
  onPointerEnter?: never
}

// Decorative artwork shares root policy, not scene materials or ID ownership.
export function IllustrationSvg(props: IllustrationSvgProps) {
  return <svg onPointerEnter={replayIllustrationOnEnter} aria-hidden="true" focusable="false" {...props} />
}
