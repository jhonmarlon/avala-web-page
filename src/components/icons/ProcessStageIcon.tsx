import { useCallback } from 'react'
import type { LucideIcon } from 'lucide-react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { useMobileIconEntry } from '@/lib/useMobileIconEntry'

// Both entry and parent hover move only the glyph, never the illuminated frame.
const gestures = {
  '1': { x: [0, 3, -2, 0], rotate: [0, -12, 6, 0] },
  '2': { rotate: [0, -18, 8, 0], y: [0, -2, 1, 0] },
  '3': { scaleX: [1, 0.82, 1.08, 1], x: [0, 0, 2, 0] },
  '4': { x: [0, -2, 4, 0], y: [0, 2, -7, 0] },
  '5': { scaleY: [1, 0.65, 1.12, 1] },
}

const rest = { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 }

type ProcessStageIconProps = { stage: string; Icon: LucideIcon }

export function ProcessStageIcon({ stage, Icon }: ProcessStageIconProps) {
  const reducedMotion = useReducedMotion()
  const sequence = Math.max(0, Number(stage) - 1)
  const preset = String(sequence % 5 + 1) as keyof typeof gestures
  const gesture = gestures[preset]
  const enter = useCallback((node: Element, complete: () => void) => {
    const glyph = node.querySelector<HTMLElement>('.process-stage-icon__glyph')
    if (!glyph) return
    const playback = animate(glyph, gesture, { duration: 0.8, ease: 'easeInOut', delay: (sequence % 3) * 0.06 })
    void playback.then(complete)
    return () => {
      playback.stop()
      if (node.isConnected) animate(glyph, rest, { duration: 0 })
    }
  }, [gesture, sequence])
  const entryRef = useMobileIconEntry<HTMLSpanElement>(enter)

  return (
    <span ref={entryRef} aria-hidden="true" data-process-icon={preset} className="process-stage-icon">
      <span className="process-stage-icon__halo" />
      <span className="process-stage-icon__frame">
        <span className="process-stage-icon__orbit" />
      </span>
      <motion.span
        className="process-stage-icon__glyph"
        initial={false}
        variants={{
          'icon-hover': reducedMotion !== false ? rest : {
            ...gesture,
            transition: { duration: 0.8, ease: 'easeInOut' },
          },
        }}
        transition={{ duration: reducedMotion !== false ? 0 : 0.24, ease: 'easeOut' }}
      >
        <Icon className="size-8" strokeWidth={1.65} focusable="false" />
      </motion.span>
    </span>
  )
}
