import { useId } from 'react'
import { IllustrationSvg } from './IllustrationSvg'
import { processScenes } from './scenes/processScenes'
import { estimatorScenes } from './scenes/estimatorScenes'
import { serviceScenes } from './scenes/serviceScenes'
import { esimScenes } from './scenes/esimScenes'
import type { SceneMaterials, SceneRenderer } from './scenes/types'

export type SequenceScene = 'discover' | 'design' | 'build' | 'launch' | 'optimize'
  | 'entry' | 'identity' | 'reserve' | 'qr' | 'protected' | 'automate' | 'integrate'
  | 'stock' | 'batches' | 'print' | 'confirmation' | 'otp' | 'trace' | 'retail'
  | 'appspace' | 'neuralmesh' | 'cloudstack' | 'strategy' | 'campaign' | 'delivery' | 'signalnet'
  | 'timeline' | 'budget'

const extractedScenes: Record<SequenceScene, SceneRenderer> = { ...processScenes, ...estimatorScenes, ...serviceScenes, ...esimScenes }

function Scene({ kind, surface, accent, edge }: { kind: SequenceScene } & SceneMaterials) {
  const renderScene = typeof kind === 'string' && Object.hasOwn(extractedScenes, kind)
    ? extractedScenes[kind]
    : undefined
  return renderScene?.({ surface, accent, edge })
}

// Symbolic explanatory artwork, never a usable QR or a live verification state.
export function SequenceIllustration({ kind }: { kind: SequenceScene }) {
  const id = useId()
  const surfaceId = `${id}-sequence-surface`
  const accentId = `${id}-sequence-accent`
  const glowId = `${id}-sequence-glow`
  const edgeId = `${id}-sequence-edge`
  return (
    <IllustrationSvg data-sequence-scene={kind} className="sequence-illustration" viewBox="0 0 96 80" fill="none" stroke="var(--color-avala-neon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={surfaceId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="color-mix(in srgb, var(--color-avala-cyan) 28%, var(--color-avala-ink-2))" />
          <stop offset="0.3" stopColor="color-mix(in srgb, var(--color-avala-neon) 12%, var(--color-avala-ink-2))" />
          <stop offset="0.58" stopColor="var(--color-avala-ink-2)" />
          <stop offset="1" stopColor="var(--color-avala-ink)" />
        </linearGradient>
        <linearGradient id={accentId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="color-mix(in srgb, var(--color-avala-paper) 32%, var(--color-avala-cyan))" />
          <stop offset="0.28" stopColor="var(--color-avala-cyan)" />
          <stop offset="0.62" stopColor="var(--color-brand-500)" />
          <stop offset="1" stopColor="var(--color-brand-700)" />
        </linearGradient>
        <linearGradient id={edgeId} x1="16" y1="12" x2="78" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-avala-paper)" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="var(--color-avala-cyan)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--color-avala-paper)" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop stopColor="var(--color-avala-neon)" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="var(--color-avala-cyan)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--color-avala-neon)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="sequence-illustration__glow" cx="48" cy="40" rx="46" ry="36" fill={`url(#${glowId})`} stroke="none" />
      <ellipse cx="48" cy="73" rx="36" ry="4" fill="var(--color-avala-neon)" fillOpacity="0.07" strokeOpacity="0.14" />
      <g className="sequence-illustration__art">
        <Scene kind={kind} surface={`url(#${surfaceId})`} accent={`url(#${accentId})`} edge={`url(#${edgeId})`} />
      </g>
    </IllustrationSvg>
  )
}
