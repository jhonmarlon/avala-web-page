import { useId } from 'react'
import { IllustrationSvg } from './IllustrationSvg'

type EsimFlowIllustrationProps = { kind: 'purchase' | 'voucher' }

// Decorative product scenes, not usable QR codes, payment controls or live states.
export function EsimFlowIllustration({ kind }: EsimFlowIllustrationProps) {
  const id = useId()
  const surface = `${id}-surface`
  const accent = `${id}-accent`

  return (
    <IllustrationSvg data-flow-illustration={kind} className="esim-flow-illustration" viewBox="0 0 120 104" fill="none">
      <defs>
        <linearGradient id={surface} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="var(--color-avala-ink-2)" />
          <stop offset="1" stopColor="var(--color-avala-ink)" />
        </linearGradient>
        <linearGradient id={accent} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="var(--color-avala-cyan)" />
          <stop offset="1" stopColor="var(--color-brand-500)" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="93" rx="48" ry="7" fill="var(--color-avala-neon)" fillOpacity="0.09" />
      <ellipse cx="60" cy="93" rx="48" ry="7" stroke="var(--color-avala-neon)" strokeOpacity="0.14" />
      {kind === 'purchase' ? (
        <>
          <path d="M80 17h9a12 12 0 0 1 12 12v9" stroke="var(--color-avala-neon)" strokeOpacity="0.4" strokeDasharray="2 4" />
          <circle cx="80" cy="17" r="3" fill="var(--color-avala-cyan)" fillOpacity="0.8" />
          <circle cx="101" cy="39" r="2" fill="var(--color-avala-neon)" />
          <g>
            <g data-illustration-part="phone" className="illustration-gesture" data-gesture="flow-main">
              <rect x="27" y="12" width="48" height="78" rx="10" fill="var(--color-avala-ink)" fillOpacity="0.5" />
              <rect x="23" y="8" width="48" height="78" rx="10" fill={`url(#${surface})`} stroke="var(--color-avala-cyan)" strokeOpacity="0.65" strokeWidth="1.5" />
              <rect x="28" y="19" width="38" height="53" rx="5" fill="var(--color-avala-neon)" fillOpacity="0.07" stroke="var(--color-avala-neon)" strokeOpacity="0.16" />
              <path d="M42 13h10M42 80h10" stroke="var(--color-avala-paper)" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
              <g data-illustration-part="esim-chip">
                <path d="M39 31h12l6 6v19H37V33a2 2 0 0 1 2-2Z" fill={`url(#${accent})`} />
                <rect x="41" y="37" width="12" height="14" rx="2" fill="var(--color-avala-ink)" fillOpacity="0.8" />
                <path d="M47 37v14M41 42h12M41 47h12" stroke="var(--color-avala-cyan)" strokeOpacity="0.7" strokeWidth="0.8" />
              </g>
              <path d="M36 63h20" stroke="var(--color-avala-paper)" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
          <g>
            <g data-illustration-part="payment-card" className="illustration-gesture" data-gesture="flow-detail">
              <rect x="63" y="59" width="52" height="34" rx="7" fill="var(--color-avala-ink)" fillOpacity="0.55" />
              <rect x="59" y="54" width="52" height="34" rx="7" fill={`url(#${accent})`} stroke="var(--color-avala-paper)" strokeOpacity="0.45" />
              <path d="M59 66h52" stroke="var(--color-avala-ink)" strokeOpacity="0.6" strokeWidth="7" />
              <rect x="66" y="75" width="10" height="7" rx="2" fill="var(--color-avala-paper)" fillOpacity="0.7" />
              <path d="M83 76h18M83 81h11" stroke="var(--color-avala-ink)" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </>
      ) : (
        <>
          <rect x="32" y="12" width="64" height="76" rx="8" transform="rotate(8 64 50)" fill={`url(#${surface})`} stroke="var(--color-avala-neon)" strokeOpacity="0.2" />
          <circle cx="103" cy="18" r="3" fill="var(--color-avala-cyan)" fillOpacity="0.65" />
          <path d="M13 71h5m-2.5-2.5v5" stroke="var(--color-avala-neon)" strokeOpacity="0.5" strokeLinecap="round" />
          <g>
            <g data-illustration-part="voucher" className="illustration-gesture" data-gesture="flow-main">
              <path d="M31 20h56a8 8 0 0 1 8 8v23a7 7 0 0 0 0 14v21a8 8 0 0 1-8 8H31a8 8 0 0 1-8-8V65a7 7 0 0 0 0-14V28a8 8 0 0 1 8-8Z" fill={`url(#${surface})`} stroke="var(--color-avala-cyan)" strokeOpacity="0.7" strokeWidth="1.5" />
              <path d="M29 58h60" stroke="var(--color-avala-neon)" strokeOpacity="0.3" strokeDasharray="3 4" />
              <g data-illustration-part="qr">
                <rect x="32" y="28" width="26" height="26" rx="3" fill="var(--color-avala-paper)" />
                <path d="M36 32h5v5h-5zm13 0h5v5h-5zM36 45h5v5h-5z" stroke="var(--color-avala-ink)" strokeWidth="2.5" />
                <path d="M46 41h4v4h4v5h-8v-4h-3v-5Z" fill="var(--color-avala-ink)" />
              </g>
              <path d="M66 33h18M66 40h13M66 47h16" stroke="var(--color-avala-paper)" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
              <path d="M35 87h45" stroke="var(--color-avala-neon)" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g data-illustration-part="scratch-panel" className="illustration-gesture" data-gesture="flow-detail">
              <rect x="35" y="68" width="48" height="13" rx="4" fill={`url(#${accent})`} fillOpacity="0.3" stroke="var(--color-avala-cyan)" strokeOpacity="0.65" />
              <path d="m39 77 5-5m4 5 5-5m4 5 5-5m4 5 5-5m4 5 4-4" stroke="var(--color-avala-paper)" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        </>
      )}
    </IllustrationSvg>
  )
}
