import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { estimatorSteps } from '@/features/estimator/data/catalog'
import { scoreRanges } from '@/features/estimator/data/ranges'
import type { ComplexityLevel } from '@/features/estimator/types/estimator.types'

const ease = [0.76, 0, 0.24, 1] as const

const complexityLabels: Record<ComplexityLevel, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  MEDIUM_HIGH: 'Media-alta',
  HIGH: 'Alta',
  ENTERPRISE: 'Empresarial',
}

// Tipos de proyecto reales del estimador, ordenados por puntaje
const projectQuestion = estimatorSteps[0]?.questions.find((q) => q.type === 'single-select')
const projectTypes =
  projectQuestion?.type === 'single-select'
    ? [...projectQuestion.options].sort((a, b) => a.points - b.points).map((o) => o.label)
    : []

const scenarios = scoreRanges.map((range, i) => ({
  ...range,
  project: projectTypes[Math.round((i / Math.max(1, scoreRanges.length - 1)) * (projectTypes.length - 1))] ?? '—',
}))

function Swap({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="block"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Vista previa que recorre escenarios reales del estimador
export function EstimatorPreview() {
  const [index, setIndex] = useState(1)

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % scenarios.length), 2600)
    return () => window.clearInterval(id)
  }, [])

  const scenario = scenarios[index]
  if (!scenario) return null

  return (
    <div className="border border-avala-paper/15 font-mono text-[0.66rem] uppercase tracking-[0.12em]">
      <div className="flex items-center justify-between border-b border-avala-paper/15 px-4 py-2.5 text-avala-paper/45">
        <span>Simulación</span>
        <span className="flex items-center gap-2">
          <motion.span
            className="size-1.5 bg-avala-neon"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          En vivo
        </span>
      </div>

      <dl className="divide-y divide-avala-paper/10">
        <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3 px-4 py-3">
          <dt className="text-avala-paper/45">Proyecto</dt>
          <dd className="normal-case tracking-normal text-avala-paper">
            <Swap value={scenario.project} className="font-sans text-sm" />
          </dd>
        </div>

        <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3 px-4 py-3">
          <dt className="text-avala-paper/45">Complejidad</dt>
          <dd className="space-y-2">
            <span className="grid grid-cols-5 gap-1">
              {scenarios.map((_, i) => (
                <motion.span
                  key={i}
                  className="h-2 origin-left"
                  animate={{ backgroundColor: i <= index ? 'var(--color-avala-neon)' : 'rgba(238,242,255,0.12)' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              ))}
            </span>
            <Swap value={complexityLabels[scenario.complexity]} className="text-avala-paper" />
          </dd>
        </div>

        <div className="grid grid-cols-2 divide-x divide-avala-paper/10">
          <div className="space-y-1 px-4 py-3">
            <dt className="text-avala-paper/45">Horas</dt>
            <dd className="display-tight tabular text-2xl normal-case tracking-[-0.03em] text-avala-paper">
              <Swap value={`${scenario.hours.min}–${scenario.hours.max}`} />
            </dd>
          </div>
          <div className="space-y-1 px-4 py-3">
            <dt className="text-avala-paper/45">Meses</dt>
            <dd className="display-tight tabular text-2xl normal-case tracking-[-0.03em] text-avala-neon">
              <Swap value={`${scenario.months.min}–${scenario.months.max}`} />
            </dd>
          </div>
        </div>
      </dl>
    </div>
  )
}
