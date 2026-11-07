import type { SVGProps } from 'react'
import { replayIllustrationOnEnter } from './illustrationHover'
import { useMobileIconEntry } from '@/lib/useMobileIconEntry'

type IllustrationSvgProps = Omit<SVGProps<SVGSVGElement>, 'aria-hidden' | 'focusable' | 'onPointerEnter'> & {
  'aria-hidden'?: never
  focusable?: never
  onPointerEnter?: never
}

// Decorative artwork shares root policy, not scene materials or ID ownership.
export function IllustrationSvg({ ref, ...props }: IllustrationSvgProps) {
  const entryRef = useMobileIconEntry<SVGSVGElement>(undefined, ref)
  return <svg ref={entryRef} onPointerEnter={replayIllustrationOnEnter} aria-hidden="true" focusable="false" {...props} />
}
