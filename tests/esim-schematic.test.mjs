import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EsimSchematic } from '../src/features/home/components/EsimSchematic.tsx'

test('eSIM schematic starts at Perfil and numbers the requested activation order', () => {
  const html = renderToStaticMarkup(React.createElement(EsimSchematic))
  const list = html.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/)?.[1] ?? ''
  const items = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)]
  const labels = items.map(([, item]) => item.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim())
  assert.deepEqual(labels, ['01 Perfil', '02 Compra', '03 QR', '04 Activa'])
  assert.match(items[0][1], /class="text-avala-paper"/)
  for (const [, item] of items.slice(1)) assert.match(item, /class="text-avala-paper\/40"/)
})
