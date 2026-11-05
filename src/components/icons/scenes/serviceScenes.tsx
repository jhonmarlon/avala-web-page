import type { SceneRenderer } from './types'

export const serviceScenes = {
  appspace: ({ surface, accent, edge }) => <>
      <g data-scene-part="handset" className="illustration-gesture" data-gesture="main">
        <rect x="16" y="8" width="35" height="61" rx="8" fill={surface} />
        <path data-material-detail="edge" d="M19 30V17a6 6 0 0 1 6-6h15M19 54v7a5 5 0 0 0 5 5" stroke={edge} />
        <path d="M28 15h10M28 63h10" strokeOpacity="0.5" />
        <rect x="23" y="25" width="21" height="25" rx="4" fill={accent} fillOpacity="0.3" />
        <path d="M28 32h11M28 39h7" strokeOpacity="0.6" />
      </g>
      <g data-scene-part="app-window" className="illustration-gesture" data-gesture="slide">
        <rect x="43" y="29" width="39" height="33" rx="6" fill={surface} />
        <path d="M43 38h39" strokeOpacity="0.4" />
        <rect x="50" y="44" width="10" height="10" rx="3" fill={accent} />
        <path d="M66 46h9m-9 6h6M50 34h3" strokeOpacity="0.6" />
      </g>
    </>,
  neuralmesh: ({ surface, accent, edge }) => <>
      <g data-scene-part="network" className="illustration-gesture" data-gesture="main">
        <path d="m20 21 23 14 29-17M20 21l-4 34 27-20 29 25V18M16 55l56 5" strokeOpacity="0.45" />
        <circle cx="20" cy="21" r="8" fill={surface} />
        <circle cx="72" cy="18" r="7" fill={accent} />
        <circle cx="16" cy="55" r="7" fill={accent} />
        <circle cx="72" cy="60" r="8" fill={surface} />
        <path data-material-detail="edge" d="M15 21a5 5 0 0 1 5-5M67 60a5 5 0 0 1 5-5" stroke={edge} />
      </g>
      <g data-scene-part="processor" className="illustration-gesture" data-gesture="light">
        <path d="M34 26v-5m9 5v-5m9 5v-5M34 54v5m9-5v5m9-5v5M29 31h-5m5 9h-5m5 9h-5m33-18h5m-5 9h5m-5 9h5" />
        <rect x="29" y="26" width="28" height="28" rx="5" fill={surface} />
        <rect x="36" y="33" width="14" height="14" rx="3" fill={accent} />
        <path d="m39 40 4-4 4 4-4 4Z" stroke="var(--color-avala-paper)" />
      </g>
    </>,
  cloudstack: ({ surface, accent, edge }) => <>
      <g data-scene-part="server-rack" className="illustration-gesture" data-gesture="main">
        <rect x="16" y="35" width="61" height="31" rx="6" fill={surface} />
        <path data-material-detail="edge" d="M19 47v-4a5 5 0 0 1 5-5h42M19 53h48" stroke={edge} />
        <path d="M16 51h61M25 43h22m-22 16h22" strokeOpacity="0.5" />
        <rect x="60" y="41" width="9" height="4" rx="2" fill={accent} />
        <rect x="60" y="57" width="9" height="4" rx="2" fill={accent} />
      </g>
      <g data-scene-part="cloud" className="illustration-gesture" data-gesture="lift">
        <path d="M31 40a12 12 0 0 1-2-24 17 17 0 0 1 32-1 13 13 0 1 1 7 25Z" fill={accent} />
        <path d="M27 23a7 7 0 0 0-5 7m12-10a11 11 0 0 1 20-1" stroke={edge} />
      </g>
    </>,
  strategy: ({ surface, accent, edge }) => <>
      <g data-scene-part="roadmap" className="illustration-gesture" data-gesture="main">
        <path d="m12 19 22-6 23 6 22-6v48l-22 6-23-6-22 6Z" fill={surface} />
        <path data-material-detail="edge" d="m15 33 0-11 19-5 23 6 18-5" stroke={edge} />
        <path d="M34 14v47m23-41v46" strokeOpacity="0.3" />
        <path d="m22 50 18-17 13 12 16-18" strokeDasharray="3 4" stroke="var(--color-avala-cyan)" />
        <circle cx="22" cy="50" r="3" fill={accent} />
      </g>
      <g data-scene-part="conversation" className="illustration-gesture" data-gesture="lift">
        <path d="M53 36h28a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H68l-10 8v-8h-5a6 6 0 0 1-6-6V42a6 6 0 0 1 6-6Z" fill={accent} />
        <path d="M56 45h22m-22 7h14" stroke="var(--color-avala-ink)" strokeOpacity="0.7" />
      </g>
    </>,
  campaign: ({ surface, accent, edge }) => <>
      <g data-scene-part="analytics" className="illustration-gesture" data-gesture="main">
        <rect x="10" y="13" width="58" height="48" rx="7" fill={surface} />
        <path data-material-detail="edge" d="M13 30v-9a5 5 0 0 1 5-5h38" stroke={edge} />
        <path d="M19 24v27h38" strokeOpacity="0.4" />
        <path d="M27 47v-9m11 9V31m11 16V25" stroke={accent} strokeWidth="6" />
      </g>
      <g data-scene-part="megaphone" className="illustration-gesture" data-gesture="tilt">
        <path d="m53 44 27-13v30L53 51Z" fill={accent} />
        <path d="M47 43h8v11h-8a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Zm10 10 6 15h-9l-4-14" fill={surface} />
        <path d="M84 39l5-3m-4 10h6m-7 7 5 3" stroke="var(--color-avala-cyan)" />
        <path d="M77 36v19" stroke={edge} />
      </g>
    </>,
  delivery: ({ surface, accent, edge }) => <>
      <g data-scene-part="pipeline" className="illustration-gesture" data-gesture="main">
        <rect x="12" y="12" width="50" height="50" rx="6" fill={surface} />
        <path data-material-detail="edge" d="M15 27v-7a5 5 0 0 1 5-5h31M15 33h39" stroke={edge} />
        <path d="M12 29h50M22 21h18M22 39h14M22 51h14" strokeOpacity="0.5" />
        <path d="M48 20h5m-5 19h5m-5 12h5" stroke={accent} strokeWidth="3" />
      </g>
      <g data-scene-part="release-loop" className="illustration-gesture" data-gesture="light">
        <path d="M61 43c-17-24-33 15-15 15 12 0 21-29 34-16 12 13-5 27-19 1Z" fill={surface} stroke={accent} strokeWidth="5" />
        <path d="m76 39 6 3-5 4M45 59l-5-3 5-3" stroke="var(--color-avala-paper)" strokeWidth="2" />
      </g>
    </>,
  signalnet: ({ surface, accent, edge }) => <>
      <g data-scene-part="tower" className="illustration-gesture" data-gesture="main">
        <path d="m46 27-19 41h38L46 27Z" fill={surface} />
        <path data-material-detail="edge" d="m32 63 14-30 8 18" stroke={edge} />
        <path d="m38 45 19 15H31l23-15M46 29v-9M22 69h48" strokeOpacity="0.6" />
        <circle cx="46" cy="20" r="5" fill={accent} />
      </g>
      <g data-scene-part="signal-waves" className="illustration-gesture" data-gesture="grow">
        <path d="M34 12a16 16 0 0 0 0 22m24-22a16 16 0 0 1 0 22M25 7a27 27 0 0 0 0 35M67 7a27 27 0 0 1 0 35" stroke={accent} strokeWidth="3" />
        <path d="M77 49h9v15h-9Z" fill={surface} />
        <path d="M80 54h3m-3 5h3" strokeOpacity="0.6" />
      </g>
    </>,
  automate: ({ surface, accent, edge }) => <>
      <g data-scene-part="workflow" className="illustration-gesture" data-gesture="main">
        <rect x="9" y="15" width="27" height="20" rx="5" fill={surface} />
        <rect x="57" y="11" width="28" height="20" rx="5" fill={surface} />
        <path d="M36 25h10v-4h11M23 35v22h25" strokeOpacity="0.6" />
        <path d="M17 22h11m-11 6h7M65 18h12m-12 6h8" strokeOpacity="0.4" />
      </g>
      <g data-scene-part="gear" className="illustration-gesture" data-gesture="tilt">
        <path d="M66 32h8l1 5 4 2 5-2 4 7-4 3v5l4 3-4 7-5-2-4 2-1 5h-8l-1-5-4-2-5 2-4-7 4-3v-5l-4-3 4-7 5 2 4-2Z" fill={accent} />
        <circle cx="70" cy="49" r="7" fill="var(--color-avala-ink)" strokeOpacity="0.4" />
        <path data-material-detail="edge" d="M59 46a12 12 0 0 1 17-8M62 50a8 8 0 0 1 8-9" stroke={edge} />
      </g>
    </>,
  integrate: ({ surface, accent, edge }) => <>
      <g data-scene-part="systems" className="illustration-gesture" data-gesture="main">
        <rect x="8" y="17" width="29" height="39" rx="6" fill={surface} />
        <rect x="59" y="24" width="29" height="39" rx="6" fill={surface} />
        <path data-material-detail="edge" d="M11 34v-9a5 5 0 0 1 5-5h12M62 41v-9a5 5 0 0 1 5-5h12" stroke={edge} />
        <rect x="15" y="25" width="15" height="10" rx="2" fill={accent} fillOpacity="0.45" />
        <rect x="66" y="32" width="15" height="10" rx="2" fill={accent} fillOpacity="0.45" />
        <path d="M15 43h15m-15 6h10M66 50h15m-15 6h10" strokeOpacity="0.4" />
      </g>
      <g data-scene-part="connection" className="illustration-gesture" data-gesture="light" stroke="var(--color-avala-cyan)" strokeWidth="2">
        <path d="M37 29h13l9 9m-8-1 8 1-1-8M59 53H46l-9-9m8 1-8-1 1 8" />
      </g>
    </>,
} satisfies Record<'appspace' | 'neuralmesh' | 'cloudstack' | 'strategy' | 'campaign' | 'delivery' | 'signalnet' | 'automate' | 'integrate', SceneRenderer>
