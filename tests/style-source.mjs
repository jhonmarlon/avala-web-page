import { readFileSync } from 'node:fs'

// Expand project-owned imports only; native font/Tailwind imports stay intact.
export function readProjectStyles(entry = new URL('../src/index.css', import.meta.url), ancestors = new Set()) {
  const url = new URL(entry)
  if (ancestors.has(url.href)) throw new Error(`Circular CSS import: ${url.href}`)
  const chain = new Set(ancestors).add(url.href)
  return readFileSync(url, 'utf8').replace(
    /^[\t ]*@import\s+(['"])(\.{1,2}\/[^'"\r\n]+\.css)\1\s*;/gm,
    (_, quote, relative) => readProjectStyles(new URL(relative, url), chain),
  )
}
