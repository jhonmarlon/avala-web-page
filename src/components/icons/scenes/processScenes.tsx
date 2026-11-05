import type { SceneRenderer } from './types'

export const processScenes = {
  discover: ({ surface, accent, edge }) => <>
      <g data-scene-part="document" className="illustration-gesture" data-gesture="main">
        <rect x="14" y="10" width="45" height="56" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M17 29V18a5 5 0 0 1 5-5h26" stroke={edge} />
        <path d="M23 23h26M23 31h20M23 39h25M23 47h12" strokeOpacity="0.45" />
        <rect x="22" y="53" width="15" height="5" rx="2" fill={accent} stroke="none" />
      </g>
      <g data-scene-part="magnifier" className="illustration-gesture" data-gesture="lift">
        <circle cx="60" cy="45" r="17" fill={surface} stroke="var(--color-avala-cyan)" strokeWidth="2" />
        <circle cx="60" cy="45" r="11" fill={accent} fillOpacity="0.18" strokeOpacity="0.3" />
        <path d="m72 58 12 12" strokeWidth="5" />
        <path d="m56 45 3 3 6-7" stroke="var(--color-avala-paper)" />
      </g>
    </>,
  design: ({ surface, accent, edge }) => <>
      <g data-scene-part="blueprint" className="illustration-gesture" data-gesture="main">
        <rect x="9" y="14" width="62" height="48" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M12 32V22a5 5 0 0 1 5-5h42" stroke={edge} />
        <path d="M9 24h62M30 24v38" strokeOpacity="0.3" />
        <rect x="16" y="31" width="8" height="22" rx="2" fill={accent} fillOpacity="0.5" />
        <rect x="37" y="31" width="25" height="9" rx="2" fill={accent} fillOpacity="0.2" />
        <path d="M37 47h24M37 53h16" strokeOpacity="0.45" />
      </g>
      <g data-scene-part="pen" className="illustration-gesture" data-gesture="tilt">
        <path d="m58 61 18-34 9 5-18 34-11 6Z" fill={accent} />
        <path d="m73 33 9 5M58 61l9 5" stroke="var(--color-avala-ink)" strokeOpacity="0.6" />
      </g>
    </>,
  build: ({ surface, accent, edge }) => <>
      <g data-scene-part="browser" className="illustration-gesture" data-gesture="main">
        <rect x="9" y="13" width="74" height="51" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M12 22v-1a5 5 0 0 1 5-5h53" stroke={edge} />
        <path d="M9 25h74" strokeOpacity="0.35" />
        <path d="M17 19h2m5 0h2m5 0h2" strokeWidth="2.5" />
        <rect x="65" y="53" width="22" height="16" rx="4" fill={accent} />
      </g>
      <g data-scene-part="code" className="illustration-gesture" data-gesture="light" stroke="var(--color-avala-paper)" strokeWidth="2">
        <path d="m32 35-9 9 9 9m27-18 9 9-9 9m-13-20-6 22" />
      </g>
    </>,
  launch: ({ surface, accent, edge }) => <>
      <g data-scene-part="server" className="illustration-gesture" data-gesture="main">
        <rect x="12" y="16" width="42" height="47" rx="6" fill={surface} />
        <path data-material-detail="edge" d="M15 28v-4a5 5 0 0 1 5-5h25M15 35h27M15 50h27" stroke={edge} />
        <path d="M12 32h42M12 47h42" strokeOpacity="0.4" />
        <path d="M20 24h15M20 40h15M20 55h15" strokeOpacity="0.5" />
        <circle cx="44" cy="24" r="2" fill={accent} /><circle cx="44" cy="40" r="2" fill={accent} /><circle cx="44" cy="55" r="2" fill={accent} />
      </g>
      <g data-scene-part="deploy" className="illustration-gesture" data-gesture="lift">
        <path d="M65 63V39H54l19-24 17 24H79v24Z" fill={accent} stroke="var(--color-avala-cyan)" />
        <path d="M64 70h17" strokeOpacity="0.4" />
      </g>
    </>,
  optimize: ({ surface, edge }) => <>
      <g data-scene-part="chart">
        <rect x="10" y="14" width="65" height="49" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M13 31v-9a5 5 0 0 1 5-5h44" stroke={edge} />
        <path d="M19 25v29h43" strokeOpacity="0.4" />
        <g data-scene-part="bars" className="illustration-gesture" data-gesture="grow">
          <path d="M28 50V40m12 10V33m12 17V25" stroke="var(--color-avala-cyan)" strokeWidth="7" />
        </g>
      </g>
      <g data-scene-part="insight" className="illustration-gesture" data-gesture="main">
        <circle cx="70" cy="51" r="14" fill={surface} strokeWidth="2" />
        <path d="m80 62 9 9" strokeWidth="4" />
        <path d="m62 54 6-6 5 3 6-8" stroke="var(--color-avala-paper)" />
      </g>
    </>,
} satisfies Record<'discover' | 'design' | 'build' | 'launch' | 'optimize', SceneRenderer>
