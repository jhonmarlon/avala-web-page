import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import logoImage from '@/assets/avala_logo.png'
import { companyInfo } from '@/config/site'
import { setScrollLocked } from '@/lib/smooth-scroll'

const MIN_DURATION = 2200
const MAX_DURATION = 4500
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
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<LogLine[]>([])
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const doneRef = useRef(onDone)

  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    setScrollLocked(true)
    const start = performance.now()
    const env = readEnvironment()
    let alive = true
    const log = (key: string, value: string) => {
      if (alive) setLines((prev) => [...prev, { at: performance.now(), key, value }])
    }

    let fontsReady = false
    document.fonts?.ready.then(() => {
      fontsReady = true
      log('fonts', `${document.fonts.size} cargadas`)
    })

    let frame = 0
    let printed = 0
    const tick = (now: number) => {
      const elapsed = now - start
      const timeP = Math.min(elapsed / MIN_DURATION, 1)
      const p = fontsReady || elapsed > MAX_DURATION ? timeP : Math.min(timeP, 0.92)
      setProgress(p)

      const due = Math.min(env.length, Math.floor(p * (env.length + 1)))
      while (printed < due) {
        const line = env[printed++]
        log(line.key, line.value)
      }

      if (p >= 1) {
        log('status', 'listo')
        setExiting(true)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!exiting) return
    const reveal = window.setTimeout(() => {
      setScrollLocked(false)
      doneRef.current()
    }, 650)
    const remove = window.setTimeout(() => setHidden(true), 1700)
    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(remove)
    }
  }, [exiting])

  if (hidden) return null

  const pct = Math.round(progress * 100)

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[95] text-avala-paper">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-avala-ink"
        animate={exiting ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1, ease, delay: 0.5 }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-avala-ink"
        animate={exiting ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 1, ease, delay: 0.5 }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.35, delay: exiting ? 0.15 : 0 }}
      >
        <div className="absolute inset-x-4 top-5 flex items-start justify-between sm:inset-x-8 sm:top-7">
          <img src={logoImage} alt="" className="h-9 w-auto sm:h-10" />
          <div className="hud-label text-right leading-5">
            <p>{companyInfo.address}</p>
            <p className="tabular">6.2442° N · 75.5812° W</p>
          </div>
        </div>

        {/* Línea de progreso a todo el ancho */}
        <div className="absolute inset-x-4 top-1/2 sm:inset-x-8">
          <div className="h-px w-full bg-avala-paper/12" />
          <div
            className="absolute left-0 top-0 h-px bg-avala-neon"
            style={{ width: `${progress * 100}%` }}
          />
          <div className="hud-label mt-3 flex justify-between">
            <span>Inicializando</span>
            <span className="tabular">{(progress * MIN_DURATION / 1000).toFixed(2)} s</span>
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
          {String(pct).padStart(3, '0')}
        </p>
      </motion.div>
    </div>
  )
}
