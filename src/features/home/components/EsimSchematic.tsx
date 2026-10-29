import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

const ease = [0.76, 0, 0.24, 1] as const
const flow = ['Compra', 'QR', 'Perfil', 'Activa']
const pins = ['VCC', 'RST', 'CLK', 'GND', 'VPP', 'I/O']

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 1.4, ease, delay },
})

// Esquemático de un perfil eSIM: tarjeta, contactos ISO 7816 y flujo de activación
export function EsimSchematic() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % flow.length), 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 320 170" className="w-full overflow-visible" role="img" aria-label="Esquema de chip eSIM">
        {/* Tarjeta con esquina recortada */}
        <motion.path
          d="M12 10 H150 L172 32 V160 H12 Z"
          fill="none"
          stroke="rgba(238,242,255,0.35)"
          strokeWidth="1"
          {...draw()}
        />

        {/* Chip: 6 contactos en dos columnas */}
        <motion.rect x="44" y="52" width="88" height="72" rx="6" fill="none" stroke="var(--color-avala-neon)" strokeWidth="1.2" {...draw(0.2)} />
        <motion.path
          d="M88 52 V124 M44 76 H132 M44 100 H132"
          fill="none"
          stroke="var(--color-avala-neon)"
          strokeWidth="1"
          {...draw(0.4)}
        />

        {/* Pistas hacia las etiquetas de pines */}
        {pins.map((pin, i) => {
          const col = i < 3 ? 0 : 1
          const row = i % 3
          const y = 64 + row * 24
          const startX = col === 0 ? 66 : 110
          const labelY = 30 + i * 22
          return (
            <g key={pin}>
              <motion.path
                d={`M${startX} ${y} H${190 + col * 8} L${214} ${labelY} H236`}
                fill="none"
                stroke="rgba(238,242,255,0.28)"
                strokeWidth="0.8"
                {...draw(0.5 + i * 0.06)}
              />
              <rect x="236" y={labelY - 2} width="4" height="4" fill="var(--color-avala-neon)" />
              <text x="246" y={labelY + 3} className="fill-avala-paper/70 font-mono text-[9px] tracking-[0.12em]">
                {pin}
              </text>
            </g>
          )
        })}

        {/* Línea de escaneo sobre el chip */}
        <motion.rect
          x="44"
          y="52"
          width="2"
          height="72"
          fill="var(--color-avala-cyan)"
          animate={{ x: [0, 86, 0], opacity: [0.9, 0.9, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <text x="20" y="152" className="fill-avala-paper/45 font-mono text-[8px] tracking-[0.14em]">
          eUICC · GSMA SGP.22
        </text>
      </svg>

      {/* Flujo de activación con el paso actual resaltado */}
      <ol className="grid grid-cols-4 gap-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]">
        {flow.map((label, i) => (
          <li key={label} className="space-y-2">
            <span className="relative block h-px bg-avala-paper/15">
              {i === step && (
                <motion.span
                  layoutId="esim-flow"
                  className="absolute inset-0 bg-avala-neon"
                  transition={{ duration: 0.5, ease }}
                />
              )}
            </span>
            <span className={i === step ? 'text-avala-paper' : 'text-avala-paper/40'}>
              <span className="tabular text-avala-neon">{String(i + 1).padStart(2, '0')}</span> {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
