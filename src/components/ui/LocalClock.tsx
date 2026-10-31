import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

// Hora real en Medellín, actualizada cada segundo
export function LocalClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time className="tabular" dateTime={now.toISOString()}>
      MDE {formatter.format(now)} UTC−5
    </time>
  )
}
