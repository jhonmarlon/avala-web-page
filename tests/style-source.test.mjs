import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'
import { readProjectStyles } from './style-source.mjs'

const css = readProjectStyles()

test('collected styles retain native font and Tailwind imports before the theme and base', () => {
  assert.match(css, /^@import url\("https:\/\/fonts\.googleapis\.com\/css2\?[^\n]+\n@import "tailwindcss";/)
  assert.equal((css.match(/@theme\s*\{/g) ?? []).length, 1)
  assert.ok(css.indexOf('@import "tailwindcss";') < css.indexOf('@theme {'))
  assert.ok(css.indexOf('@theme {') < css.indexOf('@layer base {'))
  assert.doesNotMatch(css, /@import\s+['"]\.\.?\//)
})

test('theme tokens and nested section-continue keyframes precede later UI and motion families', () => {
  assert.match(css, /--font-sans: Inter, system-ui, sans-serif;/)
  assert.match(css, /--animate-section-continue: section-continue 1\.9s ease-in-out infinite;\s+@keyframes section-continue \{\s+0%, 100% \{ transform: translateY\(0\); \}\s+50% \{ transform: translateY\(-100%\); \}\s+\}\s+\}/)
  const families = ['@theme {', '@layer base {', '@layer utilities {', '.process-stage-icon {',
    '.sequence-illustration {', '@keyframes grain-shift {', '.section-divider-baseline {',
    '.ordinal-index {', '.estimator-step-card {', '.section-label-title {']
  const positions = families.map(family => css.indexOf(family))
  assert.ok(positions.every(position => position >= 0))
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b))
})

test('collector expands nested relative quoted imports in place, allows repeats and rejects cycles', t => {
  const fixtureRoot = fileURLToPath(new URL('../node_modules/.cache/style-source-tests/', import.meta.url))
  mkdirSync(fixtureRoot, { recursive: true })
  const dir = mkdtempSync(join(fixtureRoot, 'case-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const entry = pathToFileURL(join(dir, 'entry.css'))
  writeFileSync(entry, '@import "tailwindcss";\n@import "./child.css";\n.middle {}\n@import \'./child.css\';\n.end {}')
  writeFileSync(join(dir, 'child.css'), '.child {}\n@import "./leaf.css";')
  writeFileSync(join(dir, 'leaf.css'), '.leaf {}')
  assert.equal(readProjectStyles(entry), '@import "tailwindcss";\n.child {}\n.leaf {}\n.middle {}\n.child {}\n.leaf {}\n.end {}')
  writeFileSync(join(dir, 'leaf.css'), '@import "./entry.css";')
  assert.throws(() => readProjectStyles(entry), { message: `Circular CSS import: ${entry.href}` })
})
