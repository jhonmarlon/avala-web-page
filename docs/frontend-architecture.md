# Frontend ownership and extension guide

Put changes in the existing owner below; preserve public contracts rather than
introducing a universal component or another root stylesheet. This is the current
frontend map, not a proposal for new product behavior.

## Where code belongs

| Concern | Current owner and boundary |
| --- | --- |
| App entry | `src/main.tsx` mounts RouterProvider and imports the stylesheet; there is no separate App component. |
| Routes | `src/app/router/index.tsx` owns public paths and page-scroll-pin handles. |
| Shared shell | `src/app/layouts/PublicLayout.tsx` owns Header/Footer, Outlet, motion preference, smooth scroll and page pin scope. |
| Page composition | `src/pages/` composes current views; `src/pages/EstimatorPage.tsx` preserves the feature-page re-export. |
| Neutral UI | `src/components/ui/` owns buttons, panels, sequence layout, form primitives and phone controls. |
| Presentation effects | `src/components/fx/` owns reveal, cursor, grain and CTA wrappers; do not move feature workflows here. |
| Shared utilities | `src/lib/` owns phone normalization/composition, form transport, motion, scroll and media-query helpers. |
| Shared configuration | `src/config/services.ts` owns the service catalog; site/navigation configuration stays in `src/config/`. |
| Clock | `src/components/ui/LocalClock.tsx` owns the updating Medellín time, not per-page copies. |
| Contact | `src/features/contact/` owns channel data, form validation, submission and WhatsApp composition; native mail/tel/map actions remain links. |
| Estimator | `src/features/estimator/` owns its page, proposal modal, catalog/ranges, types and calculation; email/WhatsApp actions remain feature-specific. |
| Home | `src/features/home/` owns sections and shared Home content; ManifestoSection still consumes `aboutSectionContent`. |
| Legal | `src/features/legal/` owns document data and LegalDocumentView; privacy/terms pages select documents. |

Reuse neutral phone controls and `src/lib/phone.ts`; keep feature validation and
delivery decisions with contact/estimator. Do not centralize unrelated workflows
just because they share a button or confirmation drawing.

## Styles: ordered families, one entry

`src/index.css` is **import-only**: Google fonts, Tailwind, then these local files
in this exact order under `src/styles/`:

1. `theme.css`: tokens and font roles (Inter body, Inter Tight display,
   Manrope heading, JetBrains Mono metadata).
2. `base.css`: document defaults and shared structural foundations.
3. `utilities.css`: reusable typography/layout and utility rules.
4. `process-icons.css`: About method frames and preserved compatibility selector.
5. `illustrations.css`: compact/large layout, contact depth, gestures and replay aliases.
6. `effects.css`: feedback and ambient effects.
7. `editorial.css`: editorial and surface families.

Extend the appropriate family; do not scatter new root CSS chunks or reorder the
cascade. Existing component utility classes and feature style maps keep their owners.
The `.solutions-page .service-index` rule at the end of process-icons.css is
retained: a cascade change has not been proven safe, so it is not guessed dead.
Tests read expanded ordered CSS through `tests/style-source.mjs`, not declarations
in the physical entry file.

## Decorative scene families

Public imports remain `src/components/icons/SequenceIllustration.tsx` (`kind`:
`SequenceScene`) and `src/components/icons/EsimFlowIllustration.tsx` (`kind`:
`purchase` or `voucher`). The former dispatches 28 compact scenes; the latter
keeps two larger scenes with different viewbox, geometry and material gradients.

| Compact factory owner under `src/components/icons/scenes/` | Count |
| --- | ---: |
| `processScenes.tsx` | 5 |
| `estimatorScenes.tsx` | 2 |
| `serviceScenes.tsx` | 9 |
| `esimScenes.tsx` | 12 |

Services reuse process `build`; do not add a duplicate service factory.
`src/components/icons/scenes/types.ts` defines SceneMaterials and SceneRenderer.
Only public roots own `useId`, material IDs, defs, glow/floor and SVG composition.
`src/components/icons/IllustrationSvg.tsx` shares the hook-free SVG frame,
SVG-entry replay handler and decorative `aria-hidden="true"`, `focusable="false"` policy.
Leaves are pure factories receiving surface/accent/edge strings: no hooks, IDs,
SVG/defs wrappers, new text, functional controls or real QR codes.

Do **not** merge large and compact materials, About's five colored ProcessStageIcon
frames, utility Lucide icons, or ConfirmationIcon's draw-on-mount policy.
Functional controls keep Lucide; decorative scenes do not become controls.

### Add a compact kind without changing existing behavior

1. Extend the public SequenceScene union in SequenceIllustration.
2. Add a pure factory to the matching family and its typed family key set.
3. Keep the root's complete `Record<SequenceScene, SceneRenderer>` exhaustive.
4. Extend `tests/scene-families.test.mjs`: exact keys, caller-owned materials,
   deterministic output and two independent sibling motion actors (no inherited displacement).
   Preserve static extra parts and paint order; add public rendering regressions as needed.
5. Preserve the `typeof kind === 'string'` plus `Object.hasOwn` guard and empty
   artwork fallback, including `toString` and non-string `['discover']` regressions.
   Keep the public OTP lower reflection arc sweep exactly as pinned by its test.

One consumer pattern, inside the existing host (do not add another host layer):

```tsx
import { SequenceIllustration } from '@/components/icons/SequenceIllustration'

<div className="sequence-illustration-host">
  <SequenceIllustration kind="discover" />
</div>
```

Keep public paths/props, native actions, data, motion, reduced-motion and touch
behavior unchanged. Primary/replay keyframes intentionally duplicate equivalent
curves: a real non-touch SVG entry alternates animation names for finite replay.
Do not DRY away those aliases or replace them with looping/repeated hover motion.

## Safe deletion and proof limits

A graph is evidence, not sole deletion authority: check dynamic imports,
configuration, tests, documentation and availability contracts before removal.
Four retired Home feature modules were removed; TerminalIcon and
LegacyPlaceholderPage retain explicit availability contracts, Heading/Magnetic
remain reusable, and uncertain assets remain retained. Manifesto/data ownership
is live; the removed AboutSection does not make `aboutSectionContent` dead.

See the [audit handoff](handoff/frontend-code-audit.md) for exact counts and proof:
at `baad16d`, 88 TS modules/84 entry-reachable, four unchanged active-page SSR
strings, exact ordered authored CSS/30 SVG renders and 293 passing tests were
historical observations, not a promised future test count or current rerun.
Use the [root verification commands](../README.md#verificación-del-frontend);
verification builds use Vite's `envDir: false` without reading private `.env` files.
Committed tests do not depend on Git history or prepopulated reference-source
snapshots. The stylesheet collector creates and cleans its own disposable fixtures
inside the project cache. Ignored development comparators are not test prerequisites.

SSR/source equality is not real-browser appearance, focus, animation or full-form
submission proof. The known >500 kB JavaScript chunk notice remains.
Committed native assessments resolved medium, reviewDue=false/under_budget;
that is not native review or approval. For fallback correction `716218b` only,
the human explicitly accepted unavailable independent execution (0/32 cases),
not an independent PASS or native consent. The [feature tracker](../odd/tasks/frontend-families-refactor.md)
records the final verification, local commits and closure state.
