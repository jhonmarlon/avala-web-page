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
| `/esim` | SplitReveal, NumberedStepSequence, NumberedStepPanel, CtaLink and Button retain editorial composition and native destinations. |
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

## Numbered step panels

`src/components/ui/NumberedStepPanel.tsx` owns the shared Home/eSIM article
presentation: pass `label`, numeric `number` (zero-padded for decoration), `title`,
`description`, `Icon` and optional `className`.

`src/components/ui/NumberedStepSequence.tsx` owns the shared responsive interaction
and panel sizing. Pass feature-owned `steps` (including verbatim labels), `intro`,
optional `header`/`footer` slots, and `ordered` for customer `ol`/`li` semantics.
Home retains five stages and its continue link; eSIM has four customer steps with
its protected-flow intro outside the list, on a full-width track rather than a
narrow column. Both use desktop vertical-driven horizontal travel, compact
same-tree measurement, the existing 0.45 travel budget, sticky-height endpoint
and instance-local HUD. Fitting, motion-allowed mobile uses this same document-Y
pin (not a finger-lateral swiper). Mobile reduced-motion or insufficient-height
layouts use a native horizontal row; desktop fallbacks remain vertical.
Resize/font measurements allow reentry using the same frame/track refs.
No duplicate accessible tree, hover fill or per-page scroll effects are needed.

## Contact purpose

`/contacto` welcomes general inquiries about services, eSIM, working with us or
ideas; its next steps no longer imply a discovery meeting or cost proposal.
The software estimator remains a secondary link to `/estimar-proyecto`.
The form asks for “Tu mensaje”, with optional service interests and neutral
WhatsApp wording. Validation, service choices, phone composition and delivery
payloads are unchanged. SSR and controlled callback tests cover the copy and
WhatsApp URL/body, optional fields, retry and reset without real requests;
these do not establish browser layout or end-to-end delivery.

## What remains local

- Estimator calculations, questions, selection controls, validation and proposal lifecycle.
- Contact validation, interest state, delivery payloads, retry and reset behavior.
- Home globe and Marquee resource/motion behavior; Process data and composition.
- eSIM purchase/activation content and flow rules.
- Legal content and related-document navigation.
- Page-specific composition, copy and promotion content.

These are domain differences, not duplicated generic UI. Shared formStyles and
existing typography tokens suffice; no universal field or heading framework was added.
Legacy white placeholders were preserved, not silently restyled to Home.

## Verification and limits

Latest automated suite: **109 tests, no skips**. Typecheck, environment-isolated
production build, lint and whitespace checks pass. Shared Button changes received
independent isolated verification: 576 baseline/candidate combinations, four Contact
states, 99 tests and typecheck; two public isolation probes are retained in the suite.
Row active support observed RED/GREEN; ownership moves and shell extraction used
GREEN-before/GREEN-after characterization rather than artificial failures.
The shared horizontal sequence adds mocked-geometry RED/GREEN evidence for eSIM
travel, bounded four-step HUD, fallback/reentry and Home/eSIM instance isolation;
Home's desktop viewport and font/resize fallback assertions remain intact.
These checks do not establish browser scroll pixels or focus behavior.

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

## eSIM uniform capability cards

Section 04 reuses `Card` with an optional `surface="ink"` family, avoiding the
light `panel-surface` class entirely. Existing Card defaults, native props and
children are unchanged. Feature-owned icon/title data renders six passive list
items with h3 headings, decorative icons/numbers and the original sentences in
order. Existing tokens, production fonts and the opt-in 8px `rounded-lg` radius inform the
single-column phone / two-column `sm` grid; cards fill rows without fixed heights.
Hover-capable devices receive blue border/fill feedback; 300ms transitions and
4px lift are motion-safe, with explicit reduced-motion overrides. No extra
controls, hidden detail or new business claims were added.

The editorial introduction, customer sequence, purchase destination, disabled
voucher and Contact router link are preserved. Public SSR tests establish the
new family and list semantics plus exact legacy Card defaults; CSS classes
express intent, not browser/pixel, touch or actual hover verification. Earlier
verification counts above remain historical checkpoints for their own slices.

### eSIM exit refinement

Human browser reproof rejected the first viewport-fill attempt: it moved blank
space between the panels and HUD. That policy and its constraint-clearing logic
have been removed. Only eSIM opts into `compactTrack` (default false): no forced
viewport minimum, track flex growth or artificial clamp minimum. The HUD follows
the natural row with a 16px top margin; existing panel padding remains.

Latest request: “esto deberia tener siemopre esta distancia aun cuando se este
haciendo el scroll horizontal en los pasos”. This applies to every following
boundary, not just HUD→02. The previous continuation moved the gap to 02→03;
that slot has been removed. Section 02 is again a normal sibling with its original
pb-12 / lg:pb-20; the step exit owns fixed 24px / 40px bottom padding.

`/esim` and Home `/` opt in through their router handles. `PublicLayout` keeps Header outside
a stable `PageScrollPinScope` containing the entire main and Footer exactly once.
Registration never inserts/removes this wrapper. The step core registers its
existing DOM; scope alone owns the document-Y timeline and reserve. Full frame
height F, core offset A and horizontal distance D yield root F + D×0.45,
sticky top −A, start rootTop+A and end rootTop+A+D×0.45. For core 620, full page
4000, A=600 and D=3000: root 5350, budget 1350, offsets start −600px/end 3400px.
All following sections and Footer share one displacement throughout forward,
reverse and released travel; no reserve is inserted between visible boundaries.
Only the core must fit, not the full page. No wheel interception, body lock,
section counter-transforms, duplicate content or native-scroll replacement exists;
PageDown, scrollbar, touch and existing Lenis remain document-driven.

Same-tree compact measurement restores layout in finally. Whole-frame/core/track
resize and font/viewport events are coalesced and cleaned up. Reduced motion
and oversized cores have normal flow without a reserve (mobile horizontally
scrollable, desktop vertical). Fitting mobile uses the full-page pin too. Unscoped Home
Process keeps its local timeline, track minimum, 620px mock frame,
root1970/end620 and continue link; the Home route now uses the shared scope.
Automated evidence covers public layout containment and modeled geometry, not
actual browser layout or React commit timing. No installed browser/runtime mount
harness was available: large-sticky anchor/focus, gestures, real pixels and the
registration/remount lifecycle still need browser acceptance. Independent
verification was unavailable previously; no independent GREEN or native approval
is claimed.

This correction observed RED for the missing main/Footer frame and for section
03 being outside the HUD pin. GREEN: 19 focused tests and 124 full-suite tests;
TypeScript, envDir:false production build, lint and diff-check passed. TypeScript
first rejected a negative template-literal offset type; interpolating the signed
number corrected it without changing the geometry. Existing bundle-size and Git
line-ending warnings remain. These counts supersede earlier local checkpoints.

### Home 04 and pin-aware anchors

Human request (verbatim): “perfecto ahora necesito que eso mismo que hiciste en /esim con el screoll horizontakll lo hagas en http://localhost:5173/ en  lña seccion 04- PROCESO”.
Home now uses the same route-owned frame, including all content after Process
and Footer. Its five stages, header, intro, HUD and Continue remain unchanged.
The vertical-document-Y→horizontal interaction and full-frame geometry above
are unchanged; other routes retain their legacy layout.

`scrollToTarget` accepts a cleanup-returning scoped resolver registration from
an active fitting frame. For owned normal-flow selectors it removes the current
sticky translation and adds the full travel reserve only after the step core.
Before/core anchors return to their original start even from the final step;
Continue to `#home-cases` includes the full reserve at every progress value.
Header, horizontal-track descendants and numeric document targets are unowned.
Latest measured geometry is read without registration loops; fallback, stage
exit and unmount release ownership, and obsolete cleanup cannot clear a newer
registration (even when the callback is reused).

Lenis keeps the original selector and receives a correction in its offset, so
installed 1.3.27 still applies CSS scroll-margin and root scroll-padding plus
caller header clearance exactly once. Without Lenis, active owned anchors use
the corrected numeric destination minus CSS margin/padding, preserving the
legacy native policy of ignoring the caller offset. In normal flow the original
`scrollIntoView` path remains untouched. No new input/click interception, body
lock or smooth-scroll lifecycle changes were introduced.

Tests exercise the public helper with an installed-Lenis-faithful selector model
and nonzero CSS/caller offsets; the existing hook/geometry model checks scope
ownership, progress/reverse/release, fallbacks, cleanup, Home stages/tail frame
and legacy unscoped Process. Router tests opt in only Home/eSIM and public layout
SSR checks main/Footer containment. Run the test suite command above; focused
coverage is page-scroll-pin-scope, smooth-scroll, process-scroll,
numbered-step-sequence, sequence-parity, esim-page, card and esim-capability-cards.
Observed follow-up validation: 25 focused tests and 130 full-suite tests pass
(no skips), followed by TypeScript, envDir:false build and lint. The full count
includes the preserved concurrently changed shared-ui-contracts tests. Initial
RED showed Home missing its opt-in and the missing resolver API; the helper
then passed 3 tests before Home was enabled. A subsequent scope integration
check exposed a model-only horizontal-dataset assertion on live core-height
reads; reusing measured compact core height removed that redundant layout read.
These are deterministic model/SSR checks, not real browser pixels, gestures,
focus, actual React commit/remount timing or independent/native approval.

Ink Card alone now uses Tailwind `rounded-lg` (.5rem / 8px), sourced from
`node_modules/tailwindcss/theme.css`. Selected preview 01 and system reference
match; alternatives 02/03 and legacy Card/ServiceCard radii are unchanged.
All six texts, icons, passive semantics and motion-safe 300ms translate transition
remain intact. No tuning controls were needed for this approved fixed value.

### Mobile horizontal steps — corrected primary gesture

Latest user correction (verbatim): “en mobile debe conservar el mismo efecto de detener la pag y hacer el sscroll horizontal , el scroll debe tener el mismo efecto que tiene en desktop”.
This supersedes the previous native-swiper-primary interpretation. Home's five
stages and eSIM's four steps use the **same vertical document-scroll → horizontal
track** interaction on fitting, motion-allowed phones. A vertical finger pan
advances ordinary document Y; CSS sticky visually holds the whole main/Footer
frame while progress translates the track, then releases every tail boundary
together. No new touch/wheel owner, preventDefault, body lock, scrollTo writes,
counter-transforms or following-section gap changes were introduced.

Eligibility is motion preference, not a desktop breakpoint. The existing scope
measures the actual same-tree horizontal core (including header clearance,
HUD/hint and optional Continue), requiring 0 < core height <= viewport height
and positive horizontal distance. No forced fit, fake CSS height, viewport
minimum, flex growth or clipped panel copy is used. Scope alone retains F+D×0.45,
top −A and the full-budget endpoint/resolver; it is unchanged. Panels and intro
are bounded to min(82vw,32rem) below 1024px. An opt-in `mobileCompact` panel uses
4rem decorative numbers, 24px headings, 16px/24px body and smaller spacing;
all labels, icons and copy remain. Default/desktop article classes stay exact.
The mobile HUD has a fixed-height bounded title slot, nonshrinking counter and
flexible progress; its height does not vary with the current stage.

**Accessibility fallback is not the primary gesture.** Reduced-motion mobile or
an actually oversized/zoomed core stays in native horizontal flow, never a
vertical stack: all panels remain reachable, with a named focusable scroller,
visible focus, `touch-auto`, trailing room and the lateral Spanish hint. Only
this fallback gets `data-lenis-prevent`; active pin keeps ordinary document
input. Header/footer remain outside the customer ol; intro is on the row but
outside that list. Native and pinned layouts share mounted frame/track refs so
resize, orientation, font completion and preference changes can leave/reenter
without a second reserve. Desktop reduced/short fallbacks remain vertical.

Automated proof is deterministic SSR/media policy and the existing hook/geometry
model, not browser pixel measurement. Modeled widths: 320/375/390/768/1023/1024;
375×720 with actual fixture core 620 registers F=4000, A=600, D=3000, B=1350,
root=5350, top=−600. Forward/reverse progress 0/.25/.5/.75/1 and release preserve
all modeled downstream gaps for Home/eSIM. Tests retain desktop/default panels,
fit boundaries (720 fits, 721 falls back), fallback/reentry, local contexts,
anchor cleanup and absence of page-position writes. The fixture supplies geometry;
it does not establish that production CSS computes 620px on a physical phone.

Latest correction verification: **35 focused / 148 full-suite tests passed, no
skips**, followed by TypeScript, envDir:false production build and lint (exit 0).
The existing >500 kB bundle warning remains. The explicitly mobile eSIM fixture
now expects the authorized compact classes while preserving its copy, ordering,
icons, semantic and native-action checks; default Panel assertions remain exact.
Two Home model cases now accept React SSR's nonzero `x:-750px` serialization;
this was a fixture correction, not a production timeline/math change.

Manual phone protocol on `/` and `/esim` at 320/375/390/768px:
1. With motion allowed and a fitting core, **swipe vertically**, not laterally.
   Check the whole scene visually holds, all 5/4 panels are reached, HUD tracks
   forward/reverse, Continue remains reachable and all following gaps stay fixed
   through the final release. Site Header must not cover the stage.
2. Enable reduced motion, use a short landscape viewport and pinch/text zoom.
   Check oversized cores switch to an unclipped native horizontal row, last panel
   and focus outline remain reachable, and vertical page panning still works.
3. Restore fit/motion, rotate/resize through 1024px, wait for fonts, and revisit
   Home/eSIM. Check reentry, full-budget anchors/Continue, no stale focus or
   doubled reserve, and unchanged desktop behavior.

Real gestures, pinch/focus, compositor behavior and actual React commit/remount
lifecycle are unverified here. No visual acceptance or new independent/native
approval is claimed; the parent owns fresh candidate verification and disposition.

Publication disposition: the independent verifier's isolation setup failed at
`mktemp` (exit 1) before creating a directory or running any tests. No independent
runtime verdict or source/snapshot digest was produced for this corrected pin
candidate. The parent separately repeated all 35 focused tests successfully.
After disclosure, the user explicitly chose “Subir solo la rama para revisión, indicando el faltante”.
Publish only `feat/mobile-horizontal-steps` for human
review with independent execution and physical-phone acceptance still pending;
this is not permission to merge, update develop, deploy, or claim native approval.
