import { useId } from 'react'

const contourOffsets = [0, 18, 38, 62, 88] as const

export function GlobalWaveWatermark() {
  const id = useId()
  const blue = `${id}-blue`
  const gold = `${id}-gold`
  const contour = `${id}-contour`

  return (
    <svg
      className="app-watermark"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={blue} x1="0" y1="0" x2="1" y2="1">
          <stop className="app-watermark-blue" offset="0" stopOpacity="0.65" />
          <stop className="app-watermark-highlight" offset="0.45" stopOpacity="0.3" />
          <stop className="app-watermark-blue" offset="1" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={contour}>
          <stop className="app-watermark-highlight" offset="0" stopOpacity="0" />
          <stop className="app-watermark-highlight" offset="0.25" stopOpacity="0.95" />
          <stop className="app-watermark-blue" offset="0.75" stopOpacity="0.8" />
          <stop className="app-watermark-highlight" offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gold}>
          <stop className="app-watermark-gold" offset="0" stopOpacity="0" />
          <stop className="app-watermark-gold" offset="0.3" stopOpacity="0.65" />
          <stop className="app-watermark-gold" offset="0.65" stopOpacity="0.25" />
          <stop className="app-watermark-gold" offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g data-watermark-band="top">
        <path
          d="M -80 40 C 200 280 460 220 780 90 C 1050 -20 1260 -50 1520 40 L 1520 -70 C 1160 -90 980 -20 740 55 C 420 160 200 220 -80 -30 Z"
          fill={`url(#${blue})`}
        />
        {contourOffsets.map((offset, index) => (
          <path
            key={offset}
            data-watermark-contour="blue"
            d="M -80 40 C 200 280 460 220 780 90 C 1050 -20 1260 -50 1520 40"
            transform={`translate(0 ${offset})`}
            fill="none"
            stroke={`url(#${contour})`}
            strokeWidth={index === 0 ? 1.2 : 0.85}
            strokeOpacity={1 - index * 0.12}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d="M -80 40 C 200 280 460 220 780 90 C 1050 -20 1260 -50 1520 40"
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="0.8"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g data-watermark-band="bottom">
        <path
          d="M -80 860 C 200 950 460 920 780 790 C 1080 660 1260 650 1520 800 L 1520 900 C 1260 730 1060 730 800 835 C 460 980 180 1010 -80 940 Z"
          fill={`url(#${blue})`}
        />
        {contourOffsets.map((offset, index) => (
          <path
            key={offset}
            data-watermark-contour="blue"
            d="M -80 860 C 200 950 460 920 780 790 C 1080 660 1260 650 1520 800"
            transform={`translate(0 ${-offset})`}
            fill="none"
            stroke={`url(#${contour})`}
            strokeWidth={index === 0 ? 1.2 : 0.85}
            strokeOpacity={1 - index * 0.12}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d="M -80 860 C 200 950 460 920 780 790 C 1080 660 1260 650 1520 800"
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="0.8"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}
