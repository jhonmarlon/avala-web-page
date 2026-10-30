import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Button } from '../src/components/ui/Button.tsx'

for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
  test(`Button merges styles and forwards attributes: ${JSON.stringify(destination)}`, () => {
    const onClick = () => {}
    const element = Button({ ...destination, children: 'Contactar', className: 'custom', variant: 'secondary', size: 'lg', fullWidth: true, 'aria-label': 'Contacto', onClick })
    assert.match(element.props.className, /inline-flex/)
    assert.match(element.props.className, /custom/)
    assert.match(element.props.className, /w-full/)
    assert.match(element.props.className, /min-h-\[3\.3rem\]/)
    assert.equal(element.props.onClick, onClick)
    assert.equal(element.props['aria-label'], 'Contacto')
    for (const prop of ['variant', 'size', 'fullWidth']) assert.equal(element.props[prop], undefined)
  })
}

test('Button retains defaults, disabled state and explicit submit type', () => {
  assert.equal(Button({ children: 'Enviar' }).props.type, 'button')
  const element = Button({ children: 'Enviar', type: 'submit', disabled: true })
  assert.equal(element.props.type, 'submit')
  assert.equal(element.props.disabled, true)
  assert.match(element.props.className, /min-h-11/)
})

test('Button preserves external link protection and explicit rel', () => {
  assert.equal(Button({ href: 'https://example.com', target: '_blank', children: 'Link' }).props.rel, 'noreferrer noopener')
  assert.equal(Button({ href: 'https://example.com', target: '_blank', rel: 'external', children: 'Link' }).props.rel, 'external')
})
