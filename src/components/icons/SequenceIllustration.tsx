import { useId } from 'react'
import { IllustrationSvg } from './IllustrationSvg'

export type SequenceScene = 'discover' | 'design' | 'build' | 'launch' | 'optimize'
  | 'entry' | 'identity' | 'reserve' | 'qr' | 'protected' | 'automate' | 'integrate'
  | 'stock' | 'batches' | 'print' | 'confirmation' | 'otp' | 'trace' | 'retail'
  | 'appspace' | 'neuralmesh' | 'cloudstack' | 'strategy' | 'campaign' | 'delivery' | 'signalnet'
  | 'timeline' | 'budget'

function Scene({ kind, surface, accent, edge }: { kind: SequenceScene; surface: string; accent: string; edge: string }) {
  switch (kind) {
    case 'timeline': return <>
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
    </>
    case 'budget': return <>
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
    </>
    case 'appspace': return <>
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
    </>
    case 'neuralmesh': return <>
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
    </>
    case 'cloudstack': return <>
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
    </>
    case 'strategy': return <>
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
    </>
    case 'campaign': return <>
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
    </>
    case 'delivery': return <>
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
    </>
    case 'signalnet': return <>
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
    </>
    case 'discover': return <>
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
    </>
    case 'design': return <>
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
    </>
    case 'build': return <>
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
    </>
    case 'launch': return <>
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
    </>
    case 'optimize': return <>
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
    </>
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
    case 'automate': return <>
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
    </>
    case 'integrate': return <>
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
