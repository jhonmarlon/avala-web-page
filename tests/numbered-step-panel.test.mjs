import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Smartphone } from 'lucide-react'
import { NumberedStepPanel } from '../src/components/ui/NumberedStepPanel.tsx'

const render = (props = {}) => renderToStaticMarkup(createElement(NumberedStepPanel, {
  label: 'Paso 3', number: 3, title: 'Panel title', description: 'Panel description', Icon: Smartphone, ...props,
}))

test('numbered panel renders public content, muted icon and a decorative outlined number', () => {
  const html = render()
  assert.match(html, /^<article class="relative flex shrink-0 flex-col gap-4 border-avala-paper\/15 py-8 lg:border-l lg:px-8 lg:py-6">/)
  assert.match(html, /<div class="hud-label flex justify-between"><span class="tabular text-avala-neon">Paso 3<\/span>/)
  assert.match(html, /<svg[^>]*stroke-width="1.25"[^>]*class="lucide lucide-smartphone size-5 text-avala-paper\/60"[^>]*aria-hidden="true"/)
  assert.match(html, /<p aria-hidden="true" class="display-tight text-outline tabular [^"]*\[--stroke-w:2px\][^"]*\[--stroke-c:rgba\(238,242,255,0.85\)\][^"]*drop-shadow[^>]*>03<\/p>/)
  assert.match(html, /<h3 class="display-tight text-\[clamp\(1.75rem,3vw,2.5rem\)\] leading-\[1.15\] text-avala-paper">Panel title<\/h3>/)
  assert.match(html, /<p class="text-base leading-7 text-avala-paper\/65 sm:text-lg sm:leading-8">Panel description<\/p>/)
  assert.doesNotMatch(html, /<a\b|<button\b|tabindex=|role=|lg:w-|group-hover:/)
})

test('numbered panel forwards caller classes without wrappers or duplicating label numbering', () => {
  const html = render({ label: 'Etapa 12', number: 12, className: 'lg:w-[min(64vw,56rem)] caller-panel' })
  assert.match(html, /^<article class="relative flex shrink-0 flex-col gap-4 border-avala-paper\/15 py-8 lg:w-\[min\(64vw,56rem\)\] caller-panel lg:border-l lg:px-8 lg:py-6">/)
  assert.equal((html.match(/<article\b/g) ?? []).length, 1)
  assert.equal((html.match(/Etapa 12/g) ?? []).length, 1)
  assert.match(html, /aria-hidden="true" class="display-tight text-outline[^>]*>12<\/p>/)
  assert.match(render({ number: 1 }), />01<\/p>/)
})
