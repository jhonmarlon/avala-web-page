import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import logoImage from '@/assets/avala_logo.png'
import { companyInfo } from '@/config/site'
import { setScrollLocked } from '@/lib/smooth-scroll'

const FONT_WAIT = 250
const EXIT_DURATION = 400
const REDUCED_EXIT_DURATION = 50
const ease = [0.76, 0, 0.24, 1] as const

type LogLine = { at: number; key: string; value: string }

type NavigatorWithConnection = Navigator & { connection?: { effectiveType?: string } }

// Lecturas reales del entorno del visitante: nada de texto decorativo
function readEnvironment(): Omit<LogLine, 'at'>[] {
  const nav = navigator as NavigatorWithConnection
  const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return [
    { key: 'viewport', value: `${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio}x` },
    { key: 'locale', value: navigator.language },
    { key: 'timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { key: 'threads', value: String(navigator.hardwareConcurrency ?? '—') },
    { key: 'network', value: nav.connection?.effectiveType ?? 'n/d' },
    { key: 'dom_ready', value: timing ? `${Math.round(timing.domContentLoadedEventEnd)} ms` : 'n/d' },
  ]
}

type PreloaderProps = {
  onDone: () => void
}

export function Preloader({ onDone }: PreloaderProps) {
  const reducedMotion = useReducedMotion()
  const [lines, setLines] = useState<LogLine[]>([])
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const doneRef = useRef(onDone)
  const completedRef = useRef(false)

  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (completedRef.current) return
    setScrollLocked(true)
    const start = performance.now()
    let alive = true
    let exiting = false
    let fallback: number | undefined
    let reveal: number | undefined
    const finish = (fontStatus: string) => {
      if (!alive || exiting) return
      exiting = true
      window.clearTimeout(fallback)
      const at = performance.now() - start
      setLines([
        ...readEnvironment().map((line) => ({ ...line, at })),
        { at, key: 'fonts', value: fontStatus },
      ])
      setExiting(true)
      reveal = window.setTimeout(() => {
        if (!alive) return
        alive = false
        completedRef.current = true
        setScrollLocked(false)
        setHidden(true)
        doneRef.current()
      }, reducedMotion ? REDUCED_EXIT_DURATION : EXIT_DURATION)
    }

    const fonts = document.fonts
    if (fonts) {
      fallback = window.setTimeout(() => finish('en segundo plano'), FONT_WAIT)
      fonts.ready.then(
        () => finish('listas'),
        () => finish('no disponibles; usando alternativas'),
      )
    } else {
      finish('API no disponible; usando alternativas')
    }
    return () => {
      alive = false
      window.clearTimeout(fallback)
      window.clearTimeout(reveal)
      setScrollLocked(false)
    }
  }, [reducedMotion])

  if (hidden) return null

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[95] text-avala-paper">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-avala-ink"
        animate={reducedMotion ? { opacity: exiting ? 0 : 1 } : { y: exiting ? '-100%' : 0 }}
        transition={{ duration: (reducedMotion ? REDUCED_EXIT_DURATION : EXIT_DURATION) / 1000, ease }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-avala-ink"
        animate={reducedMotion ? { opacity: exiting ? 0 : 1 } : { y: exiting ? '100%' : 0 }}
        transition={{ duration: (reducedMotion ? REDUCED_EXIT_DURATION : EXIT_DURATION) / 1000, ease }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: reducedMotion ? 0.05 : 0.15 }}
      >
        <div className="absolute inset-x-4 top-5 flex items-start justify-between sm:inset-x-8 sm:top-7">
          <img src={logoImage} alt="" className="h-9 w-auto sm:h-10" />
          <div className="hud-label text-right leading-5">
            <p>{companyInfo.address}</p>
            <p className="tabular">6.2442° N · 75.5812° W</p>
          </div>
        </div>

        {/* Lecturas del entorno, sin progreso ni tiempos simulados */}
        <div className="absolute inset-x-4 top-1/2 sm:inset-x-8">
          <div className="h-px w-full bg-avala-paper/12" />
          <div className="hud-label mt-3 flex justify-between">
            <span>{exiting ? 'Bienvenido' : 'Preparando tipografía'}</span>
            <span>Lecturas del entorno</span>
          </div>
        </div>

        <ol className="tabular absolute bottom-6 left-4 w-[min(26rem,calc(100%-2rem))] space-y-1 font-mono text-[0.66rem] text-avala-mute sm:bottom-8 sm:left-8">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3">
              <span className="w-16 shrink-0 text-avala-paper/35">{line.at.toFixed(0).padStart(5, '0')}</span>
              <span className="w-20 shrink-0 text-avala-paper/70">{line.key}</span>
              <span className="truncate text-avala-paper">{line.value}</span>
            </li>
          ))}
        </ol>

        <p className="tabular display-tight absolute bottom-3 right-4 text-[clamp(4.5rem,16vw,13rem)] leading-[0.8] sm:bottom-6 sm:right-8">
          AVALA
        </p>
      </motion.div>
    </div>
  )
}
