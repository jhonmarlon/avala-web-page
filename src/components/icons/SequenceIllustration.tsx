import { useId } from 'react'
import { IllustrationSvg } from './IllustrationSvg'
import { processScenes } from './scenes/processScenes'
import { estimatorScenes } from './scenes/estimatorScenes'
import { serviceScenes } from './scenes/serviceScenes'
import type { SceneMaterials, SceneRenderer } from './scenes/types'

export type SequenceScene = 'discover' | 'design' | 'build' | 'launch' | 'optimize'
  | 'entry' | 'identity' | 'reserve' | 'qr' | 'protected' | 'automate' | 'integrate'
  | 'stock' | 'batches' | 'print' | 'confirmation' | 'otp' | 'trace' | 'retail'
  | 'appspace' | 'neuralmesh' | 'cloudstack' | 'strategy' | 'campaign' | 'delivery' | 'signalnet'
  | 'timeline' | 'budget'

const extractedScenes: Partial<Record<SequenceScene, SceneRenderer>> = { ...processScenes, ...estimatorScenes, ...serviceScenes }

function Scene({ kind, surface, accent, edge }: { kind: SequenceScene } & SceneMaterials) {
  const renderScene = extractedScenes[kind]
  if (renderScene) return renderScene({ surface, accent, edge })
  switch (kind) {
    case 'entry': return <>
      <g data-scene-part="phone" className="illustration-gesture" data-gesture="main">
        <rect x="16" y="9" width="35" height="60" rx="8" fill={surface} />
        <path data-material-detail="edge" d="M19 31V18a6 6 0 0 1 6-6h15M19 53v8a5 5 0 0 0 5 5" stroke={edge} />
        <path d="M28 15h10M28 63h10" strokeOpacity="0.5" />
        <rect x="23" y="24" width="21" height="26" rx="4" fill={accent} />
        <path d="M29 30h9v14h-9zm4 0v14m-4-7h9" stroke="var(--color-avala-ink)" />
      </g>
      <g data-scene-part="voucher" className="illustration-gesture" data-gesture="slide">
        <path d="M59 25h24v12a5 5 0 0 0 0 10v15H59V47a5 5 0 0 0 0-10Z" fill={surface} />
        <path d="M65 33h12M65 54h12" strokeOpacity="0.5" />
        <rect x="65" y="39" width="12" height="9" rx="2" fill={accent} />
      </g>
    </>
    case 'identity': return <>
      <g data-scene-part="profile" className="illustration-gesture" data-gesture="main">
        <rect x="10" y="17" width="48" height="46" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M13 34v-9a5 5 0 0 1 5-5h29" stroke={edge} />
        <circle cx="29" cy="33" r="7" fill={accent} fillOpacity="0.35" />
        <path d="M18 52c0-12 22-12 22 0M46 28h5m-5 7h5" strokeOpacity="0.65" />
      </g>
      <g data-scene-part="shield" className="illustration-gesture" data-gesture="lift">
        <path d="m69 20 18 7v15c0 14-18 24-18 24S51 56 51 42V27Z" fill={surface} stroke="var(--color-avala-cyan)" />
        <path d="m60 42 6 6 12-14" stroke="var(--color-avala-paper)" strokeWidth="2.5" />
      </g>
    </>
    case 'reserve': return <>
      <g data-scene-part="inventory" className="illustration-gesture" data-gesture="main">
        <rect x="14" y="12" width="44" height="41" rx="6" fill={surface} strokeOpacity="0.3" />
        <rect x="20" y="19" width="44" height="41" rx="6" fill={surface} strokeOpacity="0.5" />
        <rect x="26" y="26" width="44" height="41" rx="6" fill={surface} />
        <path data-material-detail="stack-seams" d="M18 48V20a4 4 0 0 1 4-4h28M24 55V27a4 4 0 0 1 4-4h28" stroke="var(--color-avala-cyan)" strokeOpacity="0.28" />
        <path data-material-detail="edge" d="M29 46V34a5 5 0 0 1 5-5h25" stroke={edge} />
        <path d="M34 38h17M34 45h24M34 53h12" strokeOpacity="0.45" />
      </g>
      <g data-scene-part="lock" className="illustration-gesture" data-gesture="tilt">
        <path d="M64 44V34a8 8 0 0 1 16 0v10" strokeWidth="2.5" />
        <rect x="58" y="43" width="28" height="23" rx="5" fill={accent} />
        <path data-material-detail="lock-bevel" d="M61 53v-3a4 4 0 0 1 4-4h14M67 34a5 5 0 0 1 8-4" stroke={edge} />
        <path d="M62 62h20" stroke="var(--color-avala-ink)" strokeOpacity="0.3" />
        <path d="M72 51v7" stroke="var(--color-avala-ink)" strokeWidth="3" />
      </g>
    </>
    case 'qr': return <>
      <g data-scene-part="phone" className="illustration-gesture" data-gesture="main">
        <rect x="14" y="8" width="39" height="61" rx="8" fill={surface} />
        <path data-material-detail="edge" d="M17 31V17a6 6 0 0 1 6-6h18M17 54v7a5 5 0 0 0 5 5" stroke={edge} />
        <path d="M28 14h10M28 63h10" strokeOpacity="0.45" />
        <path d="m24 40 7 7 12-16" strokeWidth="2" />
      </g>
      <g data-scene-part="qr" className="illustration-gesture" data-gesture="light">
        <rect x="43" y="28" width="39" height="39" rx="6" fill="var(--color-avala-paper)" />
        <path d="M50 35h8v8h-8zm17 0h8v8h-8zM50 52h8v8h-8z" stroke="var(--color-avala-ink)" strokeWidth="3" />
        <path d="M64 48h5v5h6v7H64v-5h-3v-7Z" fill="var(--color-avala-ink)" stroke="none" />
      </g>
    </>
    case 'protected': return <>
      <g data-scene-part="route" className="illustration-gesture" data-gesture="main">
        <path d="M18 25h56v31H46" strokeDasharray="3 4" strokeOpacity="0.5" />
        <rect x="9" y="15" width="17" height="24" rx="4" fill={surface} />
        <rect x="65" y="43" width="22" height="22" rx="4" fill={accent} />
        <path d="M71 49h10v10H71Z" stroke="var(--color-avala-ink)" strokeWidth="2" />
      </g>
      <g data-scene-part="shield" className="illustration-gesture" data-gesture="light">
        <path d="m45 16 19 8v16c0 15-19 27-19 27S26 55 26 40V24Z" fill={surface} stroke="var(--color-avala-cyan)" strokeWidth="2" />
        <path data-material-detail="edge" d="M30 37V27l15-6 12 5M31 46c2 5 6 9 10 12" stroke={edge} />
        <path d="m35 40 7 7 13-15" stroke="var(--color-avala-paper)" strokeWidth="2.5" />
      </g>
    </>
    case 'stock': return <>
      <g data-scene-part="catalog" className="illustration-gesture" data-gesture="main">
        <rect x="11" y="12" width="43" height="54" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M14 31V20a5 5 0 0 1 5-5h24" stroke={edge} />
        <path d="M21 24h24M28 35h17M28 45h17M28 55h12" strokeOpacity="0.5" />
        <path d="M20 35h1m-1 10h1m-1 10h1" stroke="var(--color-avala-paper)" strokeWidth="3" />
      </g>
      <g data-scene-part="sim-card" className="illustration-gesture" data-gesture="lift">
        <path d="M57 28h17l10 10v29H53V32a4 4 0 0 1 4-4Z" fill={accent} />
        <rect x="60" y="40" width="16" height="19" rx="3" fill="var(--color-avala-ink)" fillOpacity="0.85" />
        <path d="M68 40v19M60 46h16M60 53h16" strokeOpacity="0.65" />
      </g>
    </>
    case 'batches': return <>
      <g data-scene-part="stack" className="illustration-gesture" data-gesture="main">
        <rect x="26" y="11" width="53" height="33" rx="6" fill={surface} strokeOpacity="0.3" />
        <rect x="20" y="20" width="53" height="33" rx="6" fill={surface} strokeOpacity="0.5" />
      </g>
      <g data-scene-part="voucher" className="illustration-gesture" data-gesture="slide">
        <path d="M20 30h41a6 6 0 0 1 6 6v5a5 5 0 0 0 0 10v9a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6v-9a5 5 0 0 0 0-10v-5a6 6 0 0 1 6-6Z" fill={surface} />
        <path data-material-detail="edge" d="M18 39v-2a4 4 0 0 1 4-4h35M18 54v5a4 4 0 0 0 4 4" stroke={edge} />
        <rect x="23" y="38" width="13" height="13" rx="2" fill={accent} />
        <path d="M44 39h14M44 46h10M23 57h35" strokeOpacity="0.55" />
      </g>
    </>
    case 'print': return <>
      <g data-scene-part="printer" className="illustration-gesture" data-gesture="main">
        <rect x="11" y="29" width="73" height="29" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M14 41v-4a5 5 0 0 1 5-5h52" stroke={edge} />
        <circle cx="75" cy="37" r="2" fill={accent} />
        <path d="M20 45h55" strokeOpacity="0.5" />
      </g>
      <g data-scene-part="paper" className="illustration-gesture" data-gesture="lift">
        <path d="M25 29V11h44v18" fill="var(--color-avala-paper)" fillOpacity="0.9" />
        <path d="M33 18h27M33 24h18" stroke="var(--color-avala-ink)" strokeOpacity="0.6" />
        <path d="M26 47h42v23H26Z" fill={surface} />
        <rect x="33" y="53" width="9" height="9" rx="1" fill={accent} />
        <path d="M49 55h12M49 61h8" strokeOpacity="0.5" />
      </g>
    </>
    case 'confirmation': return <>
      <g data-scene-part="printer" className="illustration-gesture" data-gesture="main">
        <rect x="8" y="28" width="44" height="28" rx="6" fill={surface} />
        <path d="M17 28V16h25v12M15 44h29" strokeOpacity="0.6" />
        <path d="M17 46h25v19H17Z" fill={surface} />
      </g>
      <g data-scene-part="confirmation" className="illustration-gesture" data-gesture="tilt">
        <path d="M58 12h19l9 9v36H53V17a5 5 0 0 1 5-5Z" fill={surface} />
        <path data-material-detail="edge" d="M56 31V19a4 4 0 0 1 4-4h14m3 0v7h6" stroke={edge} />
        <path d="M61 27h16M61 34h12" strokeOpacity="0.45" />
        <circle cx="76" cy="57" r="13" fill={accent} />
        <path d="m69 57 5 5 9-11" stroke="var(--color-avala-ink)" strokeWidth="2.5" />
      </g>
    </>
    case 'otp': return <>
      <g data-scene-part="otp" className="illustration-gesture" data-gesture="main">
        <rect x="9" y="9" width="32" height="59" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M12 29V17a5 5 0 0 1 5-5h13M12 53v7a5 5 0 0 0 5 5" stroke={edge} />
        <path d="M20 15h10M20 62h10" strokeOpacity="0.4" />
        <path d="M29 22h30a5 5 0 0 1 5 5v12H39l-8 5v-5h-2Z" fill={surface} />
        <path d="M39 30h1m7 0h1m7 0h1" stroke="var(--color-avala-paper)" strokeWidth="3" />
      </g>
      <g data-scene-part="scratch" className="illustration-gesture" data-gesture="light">
        <rect x="47" y="49" width="38" height="19" rx="5" fill={surface} />
        <path d="m53 62 6-6m3 6 6-6m3 6 6-6" stroke="var(--color-avala-cyan)" strokeWidth="2" />
      </g>
      <g data-scene-part="shield">
        <path d="m78 8 12 5v10c0 9-12 15-12 15s-12-6-12-15V13Z" fill={accent} />
        <path d="m72 22 4 4 8-9" stroke="var(--color-avala-ink)" strokeWidth="2" />
      </g>
    </>
    case 'trace': return <>
      <g data-scene-part="voucher" className="illustration-gesture" data-gesture="main">
        <rect x="7" y="13" width="22" height="29" rx="4" fill={surface} />
        <path d="M13 21h10M13 27h6M13 34h10" strokeOpacity="0.5" />
        <rect x="10" y="51" width="26" height="16" rx="3" fill={surface} />
        <path d="M10 56h26" strokeOpacity="0.3" />
      </g>
      <g data-scene-part="route" className="illustration-gesture" data-gesture="light">
        <path d="M29 28h11v12m-4 19h12V40h19" strokeOpacity="0.65" />
        <circle cx="48" cy="40" r="7" fill={accent} />
        <path d="m62 35 5 5-5 5" />
      </g>
      <g data-scene-part="qr">
        <rect x="67" y="15" width="23" height="51" rx="6" fill={surface} />
        <path data-material-detail="edge" d="M70 29v-6a5 5 0 0 1 5-5h7M70 51v8a4 4 0 0 0 4 4" stroke={edge} />
        <path d="M75 21h7M75 60h7" strokeOpacity="0.45" />
        <rect x="72" y="31" width="13" height="15" rx="2" fill="var(--color-avala-paper)" />
        <path d="M75 34h2v3h-2zm5 0h2v3h-2zm-5 6h2v3h-2zm5-1h2v4h-2z" fill="var(--color-avala-ink)" stroke="none" />
      </g>
    </>
    case 'retail': return <>
      <g data-scene-part="storefront" className="illustration-gesture" data-gesture="main">
        <path d="M14 28h46v37H14Z" fill={surface} />
        <path d="M16 11h42l9 17H7Z" fill={accent} />
        <path d="M7 28c0 9 12 9 12 0 0 9 12 9 12 0 0 9 12 9 12 0 0 9 12 9 12 0 0 9 12 9 12 0" fill={surface} />
        <rect x="21" y="40" width="13" height="17" rx="2" fill={accent} fillOpacity="0.25" />
        <path d="M40 65V40h13v25" strokeOpacity="0.55" />
      </g>
      <g data-scene-part="terminal">
        <rect x="65" y="31" width="23" height="35" rx="5" fill={surface} />
        <path data-material-detail="edge" d="M68 44v-6a4 4 0 0 1 4-4h9" stroke={edge} />
        <rect x="69" y="36" width="15" height="10" rx="2" fill={accent} />
        <path d="M71 52h2m5 0h2m-9 6h2m5 0h2" strokeOpacity="0.6" />
      </g>
      <g data-scene-part="voucher" className="illustration-gesture" data-gesture="slide">
        <rect x="49" y="54" width="25" height="17" rx="3" fill={surface} />
        <rect x="54" y="58" width="6" height="6" rx="1" fill={accent} />
        <path d="M64 59h5m-5 5h3" strokeOpacity="0.45" />
      </g>
    </>
  }
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
