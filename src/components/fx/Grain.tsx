import { useState } from 'react'

let cachedTexture: string | null = null

// Textura de ruido generada una sola vez por carga de página
function getNoiseTexture() {
  if (cachedTexture !== null) return cachedTexture
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 180
  const ctx = canvas.getContext('2d')
  if (!ctx) return (cachedTexture = '')
  const image = ctx.createImageData(180, 180)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = Math.random() * 255
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    image.data[i + 3] = 18
  }
  ctx.putImageData(image, 0, 0)
  return (cachedTexture = canvas.toDataURL())
}

// Grano de película animado por CSS sobre toda la página
export function Grain() {
  const [url] = useState(getNoiseTexture)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <div
        className="absolute -inset-[20%] animate-[grain-shift_0.9s_steps(4)_infinite] opacity-70 motion-reduce:animate-none"
        style={{ backgroundImage: `url(${url})` }}
      />
    </div>
  )
}
