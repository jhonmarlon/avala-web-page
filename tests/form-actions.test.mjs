import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { Button } from '../src/components/ui/Button.tsx'

// Inspect the modal's public element/prop boundary without mounting effects.
// This follows the existing hook-stub pattern; it does not simulate DOM focus.
const hooks = registerHooks({
  load(url, context, next) {
    if (url.startsWith('data:text/javascript,')) {
      return { format: 'module', source: decodeURIComponent(url.split(',')[1]), shortCircuit: true }
    }
    const result = next(url, context)
    return url.endsWith('/config/site.ts')
      ? { ...result, source: result.source.replaceAll('import.meta.env', '({})') }
      : result
  },
  resolve(specifier, context, next) {
    if (context.parentURL?.endsWith('/ProposalDetailsModal.tsx')) {
      const sources = {
        react: 'export const useRef = current => ({ current }); export const useEffect = () => {};',
        'motion/react': 'export const motion = { div: "motion.div" }; export const useReducedMotion = () => false;',
      }
      if (specifier in sources) {
        return { url: `data:text/javascript,${encodeURIComponent(sources[specifier])}`, shortCircuit: true }
      }
    }
    return next(specifier, context)
  },
})
const { ProposalDetailsModal } = await import('../src/features/estimator/components/ProposalDetailsModal.tsx')

function actions(node) {
  if (!node || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap(actions)
  return [
    ...(node.type === Button ? [node] : []),
    ...actions(node.props?.children),
  ]
}

for (const state of ['draft', 'sending', 'success']) {
  test(`proposal ${state} actions keep callback identity and native ref target`, () => {
    const calls = []
    const onClose = () => calls.push('close')
    const onSubmit = () => calls.push('submit')
    const tree = ProposalDetailsModal({
      lead: { fullName: 'Ana González', company: '', email: 'ana@example.com', phone: '' },
      phoneCountry: 'CO', phoneDigits: '', leadErrors: {}, leadTouched: false,
      isLeadValid: true, isLeadSubmitted: state === 'success', isLeadSubmitting: state === 'sending',
      submitError: null, honeypot: '', onClose, onSubmit,
    })
    const controls = actions(tree).map((element) => Button(element.props))
    assert.equal(controls.length, state === 'success' ? 2 : 3)
    for (const control of controls) {
      assert.equal(control.type, 'button')
      assert.equal(control.props.type, 'button')
    }
    const close = controls[0]
    assert.equal(close.props['aria-label'], 'Cerrar formulario de propuesta')
    assert.equal(close.props.onClick, onClose)
    assert.equal(close.props.disabled, undefined)
    assert.equal(close.props.ref.current, null)
    assert.equal(close.props.ref, actions(tree)[0].props.ref)
    close.props.onClick()
    if (state === 'success') {
      assert.equal(controls[1].props.onClick, onClose)
      assert.equal(controls[1].props.children, 'Cerrar')
      controls[1].props.onClick()
      assert.deepEqual(calls, ['close', 'close'])
    } else {
      assert.equal(controls[1].props.onClick, onClose)
      assert.equal(controls[1].props.disabled, state === 'sending')
      assert.equal(controls[2].props.onClick, onSubmit)
      assert.equal(controls[2].props.disabled, state === 'sending')
      assert.equal(controls[2].props.children, state === 'sending' ? 'Enviando…' : 'Quiero una propuesta personalizada')
      // Direct prop invocation tests forwarding, not native disabled dispatch.
      controls[2].props.onClick()
      assert.deepEqual(calls, ['close', 'submit'])
    }
  })
}

test.after(() => hooks.deregister())
