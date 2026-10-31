# Shared UI ownership

Consolidation preserves current behavior and visual defaults; it is not a redesign.
Task evidence and the exact authorized scope live in `odd/tasks/shared-ui-consolidation.md`.

## Route coverage

All 11 entries inherit `PublicLayout`: shared Header, Footer, Cursor, Grain,
scroll lifecycle and user-preference reduced motion. Typography and color tokens
remain in `src/index.css`.

| Route | Shared composition beyond the public layout |
| --- | --- |
| `/` | Home sections reuse CtaLink, Reveal, RowHoverFill, LocalClock and the service catalog. |
| `/contacto` | ContactForm uses Button, formStyles and shared phone UI/helpers; channels use active RowHoverFill; the page uses LocalClock. |
| `/estimar-proyecto` | Estimator and proposal actions use Button; fields reuse formStyles and shared phone UI/helpers. |
| `/esim` | SplitReveal, Reveal, RowHoverFill, CtaLink and Button retain editorial composition and native destinations. |
| `/comprar` | Existing EsimComingSoonPage, with route-specific content. |
| `/activar` | The same EsimComingSoonPage, with distinct route-specific content. |
| `/nosotros` | LegacyPlaceholderPage with the original label and title. |
| `/casos-de-exito` | LegacyPlaceholderPage with the original label and title. |
| `/soluciones` | LegacyPlaceholderPage; the estimator promotion remains page-owned content. |
| `/privacidad` | Existing LegalDocumentView and page-owned legal data. |
| `/terminos` | The same LegalDocumentView and distinct page-owned legal data. |

## Single owners

| Concern | Owner |
| --- | --- |
| Native actions, router/native links, opt-in neon/editorial families | `src/components/ui/Button.tsx` |
| Animated editorial navigation, not form submission | `src/components/fx/CtaLink.tsx` |
| Labels, controls, errors and autofill presentation | `src/components/ui/form-styles.ts` |
| Country selector and controlled national phone field | `src/components/ui/phone/` |
| Phone catalog, constants, normalization and delivery composition | `src/lib/phone.ts` |
| Site-wide service choices and icon data | `src/config/services.ts` |
| Bogotá clock | `src/components/ui/LocalClock.tsx` |
| Inert bottom-up row fill; Contact opts into `active` | `src/components/fx/RowHoverFill.tsx` |
| Repeated legacy information shell | `src/components/ui/LegacyPlaceholderPage.tsx` |
| Existing shared legal rendering | `src/features/legal/components/LegalDocumentView.tsx` |

There are no old Estimator phone files, Home clock file or Home catalog re-export.
Call neutral owners directly; do not add compatibility shims or per-view copies.
The existing Button defaults are deliberately separate from opt-in editorial
styles. Native React 19 button refs pass to the actual button element.

## What remains local

- Estimator calculations, questions, selection controls, validation and proposal lifecycle.
- Contact validation, interest state, delivery payloads, retry and reset behavior.
- Home globe, pinned Process and Marquee resource/motion behavior.
- eSIM purchase/activation content and flow rules.
- Legal content and related-document navigation.
- Page-specific composition, copy and promotion content.

These are domain differences, not duplicated generic UI. Shared formStyles and
existing typography tokens suffice; no universal field or heading framework was added.
Legacy white placeholders were preserved, not silently restyled to Home.

## Verification and limits

Latest automated suite: **102 tests, no skips**. Typecheck, environment-isolated
production build, lint and whitespace checks pass. Shared Button changes received
independent isolated verification: 576 baseline/candidate combinations, four Contact
states, 99 tests and typecheck; two public isolation probes are retained in the suite.
Row active support observed RED/GREEN; ownership moves and shell extraction used
GREEN-before/GREEN-after characterization rather than artificial failures.

```sh
node --import ./tests/register.mjs --test tests/*.test.mjs
node ./node_modules/typescript/bin/tsc -b
node --input-type=module -e "import { build } from 'vite'; await build({ envDir: false })"
npm run lint
git diff --check
```

The existing >500 kB bundle warning remains. Native review assessment was unavailable
because untracked paths require an explicit declaration; no native approval is claimed.
The independent verifier is technical evidence, not native review authority.

**Manual proof remains open:** real modal ref attachment/focus, Tab/Escape/restoration,
scroll locking, touch/hover pixels, autofill painting and full submission/reset flows.
SSR/prop checks do not establish these. No real lead, WhatsApp or checkout requests ran.
The purchase remains `https://siembradigital.avalashop.com/` in the same tab; the voucher
is a native disabled control labelled “Disponible próximamente”, with no href.

## Local review slices

The tracker remains at archival checkpoint `b32d130`. The latest local slice,
`feat/shared-ui-consolidation-07-close`, contains the complete chain; numbered child
branches retain contract, phone, catalog/clock, form-action, row-fill and shell units.
The shared Button risk unit has its own commit `def4839`. Nothing was pushed,
opened as a PR, merged into the tracker/default branch or deployed. Local
`.env.development` and `.env.production` remain untracked, unread and excluded.
Publishing and manual acceptance remain human decisions.
