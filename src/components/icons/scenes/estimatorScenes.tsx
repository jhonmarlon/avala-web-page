import type { SceneRenderer } from './types'

export const estimatorScenes = {
  timeline: ({ surface, accent, edge }) => <>
      <g data-scene-part="clock" className="illustration-gesture" data-gesture="main">
        <circle cx="36" cy="36" r="25" fill={surface} />
        <path data-material-detail="edge" d="M15 36a21 21 0 0 1 21-21m0 42a21 21 0 0 0 16-7" stroke={edge} />
        <path d="M36 18v4m18 14h-4M18 36h4m14 18v-4" strokeOpacity="0.5" />
        <path d="M36 26v11l10 6" stroke="var(--color-avala-cyan)" strokeWidth="3" />
        <circle cx="36" cy="36" r="3" fill={accent} />
      </g>
      <g data-scene-part="schedule" className="illustration-gesture" data-gesture="slide">
        <rect x="50" y="37" width="35" height="31" rx="5" fill={surface} />
        <path d="M50 47h35M59 33v8m17-8v8" strokeOpacity="0.6" />
        <path d="M57 53h8m-8 8h5" strokeOpacity="0.5" />
        <rect x="70" y="52" width="9" height="10" rx="2" fill={accent} />
        <path d="m72 57 2 2 3-4" stroke="var(--color-avala-paper)" />
        <path d="M53 44v-1a3 3 0 0 1 3-3h9" stroke={edge} />
      </g>
    </>,
  budget: ({ surface, accent, edge }) => <>
      <g data-scene-part="calculator" className="illustration-gesture" data-gesture="main">
        <rect x="16" y="10" width="43" height="58" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M19 29V18a5 5 0 0 1 5-5h24M19 54v6a5 5 0 0 0 5 5" stroke={edge} />
        <rect x="24" y="20" width="27" height="13" rx="3" fill={accent} fillOpacity="0.35" />
        <path d="M31 26h13M26 42h3m8 0h3m8 0h3M26 51h3m8 0h3M26 60h3m8 0h3" strokeOpacity="0.7" strokeWidth="3" />
        <rect x="46" y="49" width="6" height="13" rx="2" fill={accent} />
      </g>
      <g data-scene-part="coins" className="illustration-gesture" data-gesture="lift">
        <path d="M57 54v10c0 7 28 7 28 0V54Z" fill={surface} />
        <ellipse cx="71" cy="54" rx="14" ry="6" fill={accent} />
        <path d="M60 61c5 3 17 3 22 0" stroke={edge} />
        <circle cx="70" cy="40" r="12" fill={accent} />
        <path d="M62 40a8 8 0 0 1 8-8" stroke={edge} />
        <path d="M74 35h-6a3 3 0 0 0 0 6h3a3 3 0 0 1 0 6h-6m5-15v18" stroke="var(--color-avala-ink)" />
      </g>
    </>,
} satisfies Record<'timeline' | 'budget', SceneRenderer>
