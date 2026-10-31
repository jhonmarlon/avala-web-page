import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Button } from '../src/components/ui/Button.tsx'

test('legacy families cannot inherit editorial action defaults', () => {
  for (const variant of [undefined, 'primary', 'secondary', 'ghost', 'outline']) {
    for (const destination of [{}, { href: '/contacto' }, { to: '/contacto' }]) {
      const onClick = () => {}
      const element = Button({
        ...destination, variant, fullWidth: true,
        onClick, children: 'Action',
      })
      assert.equal(element.props.onClick, onClick)
      assert.match(element.props.className, /min-h-11/)
      assert.match(element.props.className, /focus-visible:ring-2/)
      assert.match(element.props.className, /w-full/)
      assert.doesNotMatch(element.props.className, /font-mono|tracking-|h-14|h-12/)
    }
  }
})

test('editorial overrides retain native disabled and ref props', () => {
  const ref = { current: null }
  const onClick = () => {}
  const element = Button({
    variant: 'editorialLine', size: null,
    className: 'h-14 px-6 disabled:opacity-50',
    type: 'button', disabled: true, ref, onClick, children: 'Action',
  })
  assert.equal(element.type, 'button')
  assert.equal(element.props.ref, ref)
  assert.equal(element.props.onClick, onClick)
  assert.equal(element.props.disabled, true)
  assert.match(element.props.className, /h-14/)
  assert.doesNotMatch(element.props.className,
    /h-12|min-h-|focus-visible:|disabled:pointer-events/)
})
