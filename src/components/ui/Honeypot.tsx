import { HONEYPOT_FIELD } from '@/lib/forms'

type HoneypotProps = {
  value: string
  onChange: (value: string) => void
}

// Campo trampa: invisible para personas y lectores de pantalla, pero los bots lo completan
export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Sitio web
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  )
}
