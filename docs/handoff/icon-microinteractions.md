# Review the icon microinteraction pilot

Branch: `feat/icon-microinteractions`. Two isolated feedback samples and scoped icon/miniillustration refinements improve presentation without new dependencies. The original Home terminal pilot was retired after user approval. The shared `CtaLink`, service catalog, submission payloads and confirmation wording remain unchanged.

## Latest follow-up — stronger hover and estimator artwork

User feedback: “los efectos de los iconos miniilustraciones no son tan notorios cuando tienen hover” and “los iconos que hay en http://localhost:5173/estimar-proyecto tambien deben tenr estilo”. This follow-up supersedes the motion/halo values in the earlier units below.

- Main motion now runs 650ms: compact bodies lift 2px, large flow bodies lift 4px. Detail runs 550ms with 5px lift/slide, 10° tilt or 1.12× bottom-origin growth. A 35–65% peak hold makes each pose easier to register before returning to rest; primary/replay aliases remain equivalent.
- Whole-item/SVG hover halo is now 8px / 55% cyan, retaining the 200ms filter transition and existing idle large-scene shadow. No whole-SVG scaling, loops, timers or replay-helper changes. Reduced motion remains static; hover guards remain.
- Parent observed RED 62/65 → GREEN 65/65 for the updated motion/replay/glow contracts. This reproduces the old short configuration structurally, not the user's perceived browser result.
- Estimator artwork is integrated: strategy introduction, discover empty state, new timeline (clock/schedule) and budget (calculator/coins) metric scenes, and the existing confirmation composition for submitted success. The catalog now has 28 compact + two large scenes. Functional arrows, selection checks, loader and close controls remain utility icons. Sizes: inline 48×40, empty/success 96×80. Calculation, submission, modal focus and all copy remain unchanged. Worker observed RED 1/6 → GREEN 6/6 plus 4/4 header/calculation checks; parent read actual new shapes, placements and modal diff and passed 81/81 combined scene/replay/estimator checks.
- Subsequent step-card correction: all five progress cards have no hover scaling or hover shadow change. Only data-step-state="active" scales to 1.03; others remain 1. Reduced motion keeps this static emphasis and disables transitions. Depth, small cyan numbers and passive navigation behavior remain. RED 1/2 → GREEN checks included in the parent's 81/81 run. This supersedes S7's earlier hover-scale rule below.
- Subsequent divider correction: the moving 1px highlight has 85% cyan shoulders and a 95% paper core, fading from 30–70% rather than 35–65%. Baseline brightness, glow and height remain unchanged; the sweep remains 2.4s, viewport-paused and disabled for reduced motion. RED 3/4 → GREEN 12/12 shared-label/card/estimator checks.
- Final combined verification for all four follow-ups passed 254/254 tests, production build, lint and whitespace checks (job-18). Existing >500kB chunk and NumberedStepPanel LF/CRLF notices remain. Browser appearance/playback is still unverified; native assessment remains unavailable because untracked scope requires declaration, with writer self-verification standing and no native review started. Older 244-test results below are historical.

## Current consistency update (S1–S8 implemented; automated verification passed)

The user's latest six-point request supersedes the earlier single-pass divider, single-piece compact scene, mixed Solutions pilot, paint-only card and small muted ordinal policies below.

- S1 implemented: a 2.4s continuous CSS sweep runs only while the separator is visible; a cyan baseline stays visible. Motion only sets the CSS play state; reduced motion disables the sweep.
- S5 implemented: six eSIM operation cards scale to 1.02 on hover-capable/no-preference input, with a 200ms transform transition; reduced motion and touch stay stationary.
- S6 implemented: plain two-digit row indices use a scoped 20px mono/cyan/glow utility. Metadata, ratios, product/case identifiers and large outlined indices are excluded. Existing ink hover/active colors remain available.
- S2/S3 implemented: all 26 compact scenes now have two independent spatial actors; all 28 roots receive clear whole-item/SVG hover glow. Foundation proof and limits are below.
- S4 source implemented: all ten Solutions entries use service-specific miniillustrations, without colored-frame fallback. About retains all five colored method frames.
- S7 source implemented: the estimator's five passive progress tiles gain layered ink depth, selected/completed distinction and guarded 1.01 hover scale. Their original 1–5 indices stay small (12px), cyan and softly lit. No new navigation controls or calculation changes.
- S8 source implemented: section names use 16–18px display type, semibold, baseline-aligned with their compact indices; metadata keeps its existing responsive treatment. The subsequent approved index adjustment uses 14px on mobile and 16px from sm, retaining mono/cyan/current glow. Focused checks passed 11/11 after observed RED; final follow-up verification passed 244/244 tests, production build, lint and whitespace checks. Existing large-chunk and line-ending notices remain; browser visual proof remains unavailable.

The first delegated S1/S5/S6 run failed without a usable report and was not relaunched. Parent bounded fixes observed RED/GREEN: S1 11/11 focused plus TypeScript/whitespace; S5 10/10; S6 44/44 plus TypeScript/whitespace. Parent reviewed S4 source and repeated 91/91 focused checks. S7 observed RED/GREEN with 6/6 estimator/header/calculation checks; S8 observed RED/GREEN and 26/26 shared-header/page checks plus TypeScript/whitespace. Final combined verification passed 244/244 tests, lint and whitespace checks. The production build passed for the unchanged source in job-15. Its only test failure was an overbroad terminal CSS assertion that also inspected the authorized continuous divider animation; this was scoped to the terminal's own two finite declarations, then the full suite passed in job-16. Existing large-chunk/plugin-timing and Git LF/CRLF notices remain. Earlier counts are historical; browser visual/pointer proof and native review remain unavailable, with the previously accepted limitation recorded.

## Current S4 catalog unit — supersedes mixed frames, partial 3D tilt and Mobile/AI preservation below

All ten `/soluciones` entries retain their original titles, descriptions, order, native CTAs/routes, entrance props, grid/spacing and 20px cyan/glow ordinal indices. Every row is a `sequence-illustration-host`; SVG entry/re-entry uses the unchanged shared pointer replay helper. The unused Solutions framed-icon import, `process-stage-card` marker and Motion `icon-hover` wiring are removed. CSS changes remove only obsolete Solutions-specific frame overrides; About's five colored method frames and generic rules remain unchanged.

| Service | Scene | Main / independent detail |
| --- | --- | --- |
| Automatización de procesos | automate | workflow / gear |
| Desarrollo web | build | browser / code |
| Aplicaciones móviles | appspace | handset / app-window |
| Inteligencia artificial | neuralmesh | network / processor |
| Integraciones | integrate | systems / connection |
| Cloud | cloudstack | server-rack / cloud |
| Consultoría | strategy | roadmap / conversation |
| Marketing digital | campaign | analytics / megaphone |
| DevOps | delivery | pipeline / release-loop |
| Telecomunicaciones | signalnet | tower / signal-waves |

The seven new cyan/blue product compositions reuse instance-local four-stop surface/accent gradients, edge reflections, floor, contact shadows and the existing 5px / 45% whole-item/SVG halo. Each has exactly two non-nested semantic actors: main 500ms and detail 400ms. No framework/helper changes, external assets, SVG text, usable QR, live status or extra interaction are added. All 19 prior compact artworks and both large flows remain unchanged. Compact service dimensions remain 64×54 mobile / 96×80 desktop; decorative accessibility and reduced-motion/touch behavior are retained.

Writer proof (foreground, 30s timeouts):

- `node --import ./tests/register.mjs --test tests/sequence-illustrations.test.mjs tests/illustration-hover.test.mjs tests/process-stage-icons.test.mjs tests/company-pages.test.mjs tests/page-component-entrances.test.mjs tests/ordinal-indices.test.mjs tests/sequence-parity.test.mjs`: RED 72/91 passed, 19 expected missing-scene/mapping/actor/replay failures. The first implementation run passed 90/91: the entrance contract exposed a leftover framed-card class. Removing that obsolete Solutions marker (without editing the entrance test) corrected the mismatch; final GREEN 91/91 passed. Actual entrance props were preserved.
- `node node_modules/typescript/bin/tsc -b`: passed without output.
- Whitespace result is recorded in the writer handoff.

All-scene material, local-ID/reference, accessibility, dimensions, two-actor/semantic and four-entry replay contracts now cover 26 compact + two large roots. About frame, catalog content/CTA/order, ordinal and slider parity checks pass. This is structural/event-fixture evidence, not browser appearance or animation proof. S1 continuous separator, S2/S3 actor/glow foundation, S5 card scale and S6 ordinal CSS are preserved. All six corrections are source-implemented and the required focused command is green; parent full-suite/build/lint/browser verification remains pending. The historical 225-test baseline is not proof for this candidate.

## Current S2/S3 artwork unit — supersedes compact single-piece/light-only rules below

S2: each existing compact composition has exactly two local `g.illustration-gesture` actors, never its art wrapper or floor. The added main actor lifts 1px over 500ms. Existing foreground actors retain 2px lift, 3px slide, 6° tilt or bottom-origin 1.06× growth over 400ms; formerly light-only actors now lift 2px. The legacy `light` variant/alias names remain for replay compatibility, not brightness animation. Optimization moves its separate insight and bars rather than nesting two animated actors. Other extra scene parts remain still.

Main actors: document, blueprint, browser, server, insight, phone (entry/QR), profile, inventory, protected route, workflow, systems, catalog, stack, printer (print/confirmation), OTP phone, trace voucher and storefront. Existing geometry, material gradients/reflections, local React IDs, semantics, viewports and responsive sizes are unchanged.

The two large flows retain their approved 500ms −3px main lift and 400ms +2px detail slide, including sibling voucher/scratch layers. `illustrationHover.ts` is unchanged: every SVG entry replays both local actors with equivalent alternating animation names; whole-item CSS hover still works. Four successive entries, mouse/pen, ignored touch/missing targets and no exit/end replay are pinned for all 21 roots. No hooks, timers, observers, autoplay or loops were added.

S3: whole-SVG hover now adds a 5px / 45% cyan edge halo with a 200ms filter transition. Both SVG sizes respond to `.sequence-illustration-host`, `.esim-capability`, `.esim-flow` or direct SVG hover. Compact ambient light and all baseline contact/depth shadows remain; idle bloom is unchanged. Hover light is separate from the spatial-motion media guard: reduced motion keeps immediate static light but disables transitions and positional animation. Touch remains static.

Observed writer verification (foreground, 30s timeouts):

- `node --import ./tests/register.mjs --test tests/illustration-hover.test.mjs tests/sequence-illustrations.test.mjs tests/esim-icons.test.mjs tests/esim-capability-cards.test.mjs tests/sequence-parity.test.mjs tests/process-stage-icons.test.mjs`: RED 42/66 passed, 24 expected failures for paired compact actors, spatial aliases and stronger independent halo; GREEN 66/66 passed.
- `node node_modules/typescript/bin/tsc -b`: passed without output.
- `git diff --check`: final observed result is reported in the writer handoff.

Self-inspection preserves the parent's S1 continuous divider, S5 operational-card scale and S6 indices. Large-flow source/helper, About frames, Solutions mapping, content, disabled states, panel parity and scroll logic were not changed. S4 was subsequently source-implemented in the catalog unit above; its current proof supersedes this foundation-only checkpoint. These are public render/event/CSS contracts, not browser appearance or animation proof. Full-suite/build/lint/browser verification remains parent-owned and pending for this candidate; historical counts below are not current proof. This is not completion of the six-point feature.

## Preview

Run `npm run dev`, then compare:

| Location | Pilot | Existing reference |
| --- | --- | --- |
| Desktop header: “Agendá una reunión” | Static label; arrow moves diagonally by 2px over 200ms on hover or keyboard focus | Other editorial CTAs retain their rolling label and rotating arrow |
| Home service catalog | Uniform titles without the isolated Desarrollo web terminal symbol | All row numbers, descriptions, native links, hover treatment and floating previews remain unchanged |
| Contact success panel | Check draws once over 400ms; panel enters over 200ms | Submission logic, WhatsApp handoff and all messages are unchanged |

The header CTA remains desktop-only. Home service titles no longer include the isolated terminal at any breakpoint; the reusable terminal helper remains available but is not wired into that list. No information requires hover. New decorative SVGs are hidden from screen readers and have no separate focus stops. Reduced motion disables both icon animations and the pilot arrow transform; the contact form/panel also omits positional transitions.

Terminal and check geometry are adapted from [Lucide Animated](https://github.com/pqoqubbw/icons). CSS replaces their original interaction controllers and removes the terminal's continuous blinking. The MIT notice is shipped at [/licenses/lucide-animated.txt](/licenses/lucide-animated.txt). No icon CDN, external player or new package is required.

## About method: stronger visual treatment

The screenshot feedback targets `/nosotros` → “Así trabajamos”, not the header pilot. All five method icons now use 64px illuminated badges with 32px glyphs, colored inset outlines and a soft halo. Colors come from the current `src/index.css` Avala palette: cyan, violet, neon and gold.

`ProcessStageIcon` uses five gesture presets: search sweep, pen tilt, code expansion, rocket lift and chart growth. Following the latest user correction, glyphs no longer animate automatically on entry or every 8–12 seconds. Each 800ms gesture plays on hover over either the icon or its entire parent item, once per hover, and returns to rest when the pointer leaves. About method cards and Solutions rows own the `icon-hover` variant; the glyph inherits it without a local animation override. Reduced-motion or an unresolved preference disables hover animation.

Hovering the passive card still intensifies its halo. On touch both the glyph and frame remain static; nothing requires hover to read or identify the content. No button role or additional tab stop is added.

The shared process data and the Home process presentation are unchanged. Titles, descriptions, order, page entrances and the cases CTA are preserved. Tests cover those contracts and disabled motion, not pixel appearance.

## Stable professional frames

Following a design discussion, the user approved removing permanent jelly motion for a more restrained B2B presentation. Illuminated frames remain still at rest: no deformation, radius morph, moving light or periodic animation. Border, gradient fill, shadow and inset decoration stay in the independent `process-stage-icon__frame` layer.

The approved refinement uses 12px outer corners and 6px inset-decoration corners. Hover over either the icon or its card/row raises the badge by 2px and tilts it by −2°, strengthens its border/glow and slightly brightens the frame background. These responses use 200ms ease-out transitions, without bounce or deformation. The 64px layout footprint stays fixed. The existing 800ms glyph gesture on item/icon hover is unchanged. Reduced motion suppresses the lift, tilt, glyph gesture and transitions; border/background feedback remains immediate. The obsolete jelly keyframes, phase variables, visibility observer and active-state attribute have been removed. Browser appearance remains unverified.

## Solutions catalog

Seven catalog symbols on `/soluciones` retain the illuminated badge, stable frame and item/icon hover-only glyph gestures; the three-service miniillustration pilot is described below. The `solutions-page` scope replaces the default −2° planar frame rotation with a partial −10° Y-axis tilt, 600px perspective and a 220ms transition. It retains the 2px lift and glow; it is not a 180° flip. About keeps its original treatment. A scope-specific reduced-motion override disables the depth tilt. All service titles, descriptions and CTAs are unchanged. On mobile the badge sits below its row number beside the description; on desktop it occupies the rightmost artwork column. Icons are no longer desktop-only. The process data and service catalog themselves remain unchanged.

## eSIM product variant

`/esim` keeps the Lucide family for UI symbols with a quieter, cyan-only treatment. The two entry flows use bespoke product miniillustrations in that same palette. No new library, brand palette or marketing-style rotation is introduced.

| Role | Treatment |
| --- | --- |
| Four customer steps | Compact 96×80 explanatory scenes beside the unchanged outlined stage number; matching protected-flow illustration in the intro |
| Purchase / voucher flows | Bespoke 120×104 SVG scenes: phone + eSIM chip + payment card, and physical voucher + illustrative QR + scratch panel; above text on phones, alongside it from sm |
| Six operational capabilities | Individual 96×80 scenes for eSIM inventory, voucher batches, printing, print confirmation, OTP/scratch validation and traceability; original card geometry and text retained |
| Partner callout | 96×80 storefront, terminal and physical-voucher scene with voucher-only hover gesture; contact text and CTA unchanged |

Operational cards retain border/background feedback but no longer lift: only one inner semantic part responds. Purchase/voucher rows use `EsimFlowIllustration` with the approved two-layer exception described below; CSS restores the original independent curves without Motion hover wiring. The QR, scratch panel and card details are decorative, not usable codes, payment controls or live validation states. Instance-specific React IDs keep local SVG gradient references unique. The illustrations are ARIA-hidden and unfocusable. Hover gestures require a hover-capable pointer and a no-preference motion setting; reduced motion explicitly disables them. Other cards and marketing badges are unchanged.

All eSIM explanatory visuals now use composed scenes, including the partner callout. The superseded `EsimIconBadge` component and unused badge CSS were removed. Feature-owned miniillustrations replace the slider and operational symbols, with an optional illustrated-panel slot described below. Copy, ordering, links, OTP/payment rules and coming-soon states are preserved; scroll measurement and progress logic stay unchanged. No API calls or transaction behavior changed.

The 3D-tilt and miniillustration refinement passed 19/19 focused tests. Final verification passed 167/167 tests, production build, lint and whitespace checks. Browser appearance and pointer behavior remain unverified.

## Compact slider scenes and three-service pilot

The user selected both sliders: Home “Así trabajamos” and eSIM “Del ingreso al QR final”. Their small HUD symbols are replaced by compact 96×80 miniillustrations beside the unchanged outlined stage number, rather than adding height to the HUD. Home has discovery, design, construction, deployment and optimization scenes. eSIM has entry choice, identity, inventory reservation and final QR scenes, plus a protected-flow scene in its introduction. The Home introduction stays text-led.

`SequenceIllustration` shares the existing cyan/blue SVG palette, subtle gradient depth and symbolic details. It is ARIA-hidden, unfocusable and has unique local gradient IDs. QR/shield imagery explains the surrounding text, not live payment or verification status. A single 400ms hover gesture is CSS-driven and disabled with reduced motion; a small SVG pointer-entry helper replays it as described below, without timers or autonomous motion.

`NumberedStepPanel` accepts an optional decorative `illustration` node, falling back to its original Lucide icon and exact default structure when omitted. Both consumers opt in locally; the source process catalog and scroll measurement/progress/ref/observer logic are unchanged. The number and illustration share a flex row that retains the original number typography, text and responsive panel widths.

The user also approved the earlier three-service trial in `/soluciones`: Automatización de procesos (workflow + gear), Desarrollo web (browser + code) and Integraciones (connected systems). These reuse the same catalog and brief hover treatment, without the whole-frame 3D tilt. The other seven service badges retain their existing behavior. Service scenes render at 64×54 on smaller screens and 96×80 on desktop; the desktop artwork column accommodates that width. No service copy, ordering, links or actions changed.

The six operational-card scenes also reuse this catalog; their semantic part gestures replace the former card lift to avoid stacked motion. All six capability sentences, ordinal labels and grid ordering remain unchanged. The partner illustration adds a storefront, terminal and voucher in the same compact style, without introducing a new interactive control.

Compact scenes now have a local radial blue/cyan halo behind the artwork and restrained edge/depth drop-shadows. Hover increases only halo opacity over 180ms (the icon itself, its illustrated parent, or its operational card); reduced motion disables that transition. There is no pulse or loop, and SVG dimensions and scroll logic remain unchanged. Aplicaciones móviles and Inteligencia artificial explicitly retain their original cyan/gold framed icons and hover behavior, not miniillustrations.

Soluciones catalog indices now use a local editorial style: 18px monospaced, weight 600, tighter tracking and softened cyan. Their original zero-padded values 01–10 remain intact. The desktop index column is closer to the title; mobile artwork space and all slider numbering are unchanged. No number boxes, glow or animation were added.

The slider/pilot/numbering expansion passed 47/47 focused checks, and the subsequent partner-scene focused run passed 37/37 checks, after observed RED. Before the ambient-light adjustment, the combined run passed 191/191 tests. Ambient lighting then passed 38/38 focused checks after observed RED; the final combined run passed 192/192 tests, production build, lint and whitespace checks. Existing large-chunk warnings remain; Git also reported its normal LF-to-CRLF normalization notice. Actual layout and pointer behavior still require browser review.

## Compact material refinement

The selected “Más volumen y detalle” finish keeps all 19 compositions and the existing cyan/gold framed mobile-app and AI icons. Four-stop surface gradients now run from a controlled cyan-lit face into deep ink; accent pieces move from a pale specular edge through cyan/blue into a darker lower edge. Each scene adds an inset edge or corner reflection, using an instance-local gradient. The inventory reservation example also adds visible stack seams, a lock/shackle bevel and a lower lock lip.

Tight dark contact shadows separate scene parts. The artwork's former soft blue shadow is narrowed rather than intensified; the ambient halo and its hover behavior are unchanged. Dimensions, caller API, decorative semantics, content, layout and reduced-motion behavior remain intact. No new movement, hooks or dependencies were added. Separately, the user approved removing Home's isolated terminal pilot; all list titles now share the same structure, with existing links and hover previews preserved.

Material-contract tests first failed on the missing richer surface, then the exact three-file focused run passed 39/39 checks. Coverage includes all 19 rendered scenes, per-SVG reference resolution, reflection/detail markers, depth CSS and existing framed-icon, sizing and motion regressions. These are structural checks, not visual proof. Browser acceptance of the new finish at mobile and desktop sizes is unavailable and still required; the parent subsequently passed 43/43 combined focused checks including the Home terminal removal. Final verification passed 193/193 tests, production build, lint and whitespace checks; existing large-chunk and Git line-ending notices remain.

## Semantic miniillustration hover — current rule

All 19 compact scenes have exactly one `illustration-gesture` group with a `data-gesture` variant. The two larger flows alone use the approved paired-layer exception below. The art wrapper, frames and background pieces stay still. Hover over the SVG or its entire containing item plays one finite 400ms ease-in-out gesture, returning to rest, without bounce, loops or autoplay. Translation is at most 3px, rotation 6°, and chart growth 1.06× from the bottom. The light gesture raises brightness from 1 to 1.18 with a transient 2px cyan drop-shadow at its peak and returns to rest, preserving the existing contact shadow rather than dimming the selected detail. This applies to code, QR, shield, connection, OTP scratch and trace route; their semantic targets and rest appearance remain unchanged. Touch defaults static; reduced motion explicitly cancels animation and transforms. Existing ambient halo opacity feedback remains unchanged.

| Scene | Single target | Gesture |
| --- | --- | --- |
| discover | magnifier | 2px lift |
| design | pen | 6° tilt |
| build | code | light |
| launch | deploy arrow | 2px lift |
| optimize | chart bars only | bottom-origin growth |
| entry | voucher | 3px slide |
| identity | shield | 2px lift |
| reserve | lock | 6° tilt |
| qr | QR card | light |
| protected | shield | light |
| automate | gear | 6° turn |
| integrate | connection | light |
| stock | SIM card | 2px lift |
| batches | foreground voucher | 3px slide |
| print | paper | 2px lift |
| confirmation | confirmation slip | 6° tilt |
| otp | scratch panel | light |
| trace | route | light |
| retail | voucher | 3px slide |
| purchase (large exception) | phone / payment card | 3px lift, 500ms / 2px slide, 400ms |
| voucher (large exception) | foreground body + QR/text / sibling scratch strip | 3px lift, 500ms / 2px slide, 400ms |

Slider/Solutions hosts, operational items and larger flow rows trigger the same vocabulary. The retailer callout now carries the existing host class; the protected intro already does. Home/eSIM panel class parity is unchanged. Artwork, local material/reflection gradients, contact shadows, responsive dimensions, numbering, content, links and disabled states are preserved; colored framed icons are not modified.

Previous candidate proof: the new render/CSS contracts observed RED (33/42 passing, nine expected failures on missing targets/guards and obsolete layers/lift), then GREEN (42/42) with the exact five-file focused command supplied by the parent. `node node_modules/typescript/bin/tsc -b` passed without output. Whitespace verification is reported in the writer handoff. Parent review repeated 42/42 focused checks, then corrected the light gesture with observed RED/GREEN. The first full run exposed one stale entrance-test expectation of the removed JavaScript hover label; production build, lint and whitespace checks passed. The updated CSS-only hover contract and all existing entrance/content checks passed the combined 50/50 focused run. Final confirmation passed 194/194 tests, lint and whitespace checks. The production build had already passed for the unchanged source. The stale expectation is resolved; no automated check remains pending. Browser visual/pointer proof remains unavailable; older counts below describe earlier candidates only.

## Missing-looking hover correction — superseded grouped-voucher candidate

User request: "esos iconos deberian tener el efecto de hover si hacen haver en el item que lo contiene y en el icono mismo". Concrete failure: "algunos iconos como por ejemplo este C:\Users\ASUS\AppData\Local\Temp\gpSCr4al\pi-clipboard-c6b0a61f-7939-4d55-8ff8-1523f784f84f.png quedaron sin el efecto". The parent identified the image as `/esim` → “Activar voucher físico”; the quoted image path was not read.

Before the fix, rendered markup assigned the large voucher's only gesture to a detached scratch-panel group, using light rather than displacement. CSS gave both host and SVG hover the same finite animation name: entering the SVG after the containing item's gesture finished could not change that name. These are structural/deterministic findings; low-alpha artwork making brightness-only feedback hard to notice is an inferred perceptual cause. Browser reproduction is unavailable.

The foreground voucher now slides 3px as one group, carrying its QR, text and scratch strip; the backing sheet stays still. Both SVG roots share a tiny pointer-enter helper that alternates a persistent data phase on the existing gesture target between equivalent primary/replay animation names. Whole-item entry retains CSS fallback. SVG entry/re-entry can therefore restart a completed gesture while the item remains hovered. SVG exit changes nothing and does not replay. Touch and missing targets are ignored. No forced layout, timers, hooks, observers, loops, caller-prop changes or dependencies were added; the hover-capable/no-preference CSS guard remains authoritative, with reduced motion static.

Writer verification (30s foreground timeouts):

- `node --import ./tests/register.mjs --test tests/illustration-hover.test.mjs tests/sequence-illustrations.test.mjs tests/esim-icons.test.mjs tests/esim-capability-cards.test.mjs tests/sequence-parity.test.mjs tests/process-stage-icons.test.mjs`: RED 41/65 passed, 24 expected failures (voucher mapping/group, 21 missing SVG entry handlers, missing replay aliases); GREEN 65/65 passed.
- `node node_modules/typescript/bin/tsc -b`: passed without output.
- `git diff --check`: passed; Git reported an LF-to-CRLF normalization warning for the pre-existing `NumberedStepPanel.tsx` change.

Public exported components are rendered with real React/useId; a narrow JSX loader captures their public SVG event props. Minimal DOM-shaped fixtures verify four successive entries, mouse/pen, ignored touch/missing targets and absence of exit/end handlers. Render/CSS assertions cover all 21 single targets, scratch ancestry, local references/accessibility/sizing, alias parity, finite duration, shadow preservation and reduced-motion guards. Fake DOM/CSS contracts do not prove actual browser animation or perceived strength. Full suite/build/lint and native assessment remain parent-owned and were not run for this correction; historical counts above are not results for this writer change. Colored frames, materials, layout, scroll, business text/actions and disabled states were not edited.

## Approved large-flow exception — current writer proof

The user selected restoring the former effect **only for the two large eSIM flows**, then requested additional professional hover shine. This supersedes the grouped-voucher single-target correction above, not the 19 compact single-piece gestures. A compact two-layer recommendation is proposal-only and remains unimplemented.

- Phone/main voucher: `y: [0, -3, 0]` over 500ms; payment card/scratch detail: `x: [0, 2, 0]` over 400ms. Both use one finite ease-in-out cycle, no bounce or autoplay. Voucher body, QR and text share the main group; scratch is its sibling. Backing sheet, floor and decorative route stay still.
- Hover over the whole `.esim-flow` row or the SVG adds a restrained 3px cyan edge drop-shadow over 200ms, retaining the baseline depth shadow. No new idle bloom or pulse. Both the extra glow and movement require hover capability and no motion-reduction preference; touch stays static and reduced motion suppresses positional animation and transitions.
- The existing SVG entry helper now visits every local gesture target, switching both large layers between equivalent primary/replay keyframes on each actual entry, even after row motion finishes. Compact roots still replay only their single target. Touch/missing targets are no-ops; no exit/end replay, timers, hooks, observers, state or layout reads.
- Caller API, 120×104 viewport, artwork, IDs, gradients, accessibility, links, content and scroll remain unchanged. Compact material/400ms gestures/halo and colored frames are untouched.

Observed writer proof (foreground, 30s timeouts): the exact six-file focused command recorded RED 40/66 passing (26 expected failures: paired targets, helper fixture API, original curves/aliases and glow), then GREEN 66/66. `node node_modules/typescript/bin/tsc -b` passed without output. Public component/event-prop fixtures and CSS contracts are structural evidence only, not browser proof. The final whitespace result is in the writer handoff.

The parent's preceding grouped-voucher candidate passed 217/217 full tests, production build, lint and diff checks. The subsequent large-flow exception was fully verified by parent job-12: 218/218 tests, production build, lint and diff checks all passed (exit 0). Independent read-only verifier `mw3wlzch-5-wcjk` PASSed item 3, including 24/24 public gesture tests, actual CSS cascade/replay and preservation of all 19 compact single-part scenes. These results are historical evidence for the large-flow exception, not verification of the editorial presentation unit below. Browser visual/pointer proof and native assessment were unavailable; no native review was invoked. No feature S# locator was supplied for that bounded unit.

## Editorial indices and operational-card depth — S1/S2

S1 promotes only the six `/esim` “Operación y trazabilidad” indices (01–06); S2 promotes only the five `/nosotros` “Así trabajamos” method indices (01–05). Both reuse `display-tight`, `text-outline` and tabular numerals with a local 44–56px responsive size, stable line height and a 1.5px paper/cyan outline. The numbers keep their existing positions (eSIM right, About left) and accessibility semantics. About highlights, Solutions indices, slider numbering and section metadata remain unchanged. About receives no new background or icon-frame treatment.

Only the six eSIM operational Card instances receive a layered blue-ink radial/linear gradient, inset edge highlight, restrained border and soft depth shadow. Whole-item hover strengthens border, light and shadow through explicit 300ms paint-only transitions; the card and text do not translate, tilt or scale. Reduced motion suppresses these transitions while retaining immediate paint feedback. Touch keeps the rich rest surface. Existing card padding/radius, grid, native list roles, exact content/order, illustration dimensions/gestures/replay, page entrances, links and disabled controls remain unchanged. Generic `Card.tsx` and all previously audited motion CSS are untouched; the new styles are appended and narrowly scoped. SectionLabel divider shine is implemented in the bounded unit below. Compact two-layer gestures and Solutions ten-miniillustration unification remain recommendations only.

Writer verification (foreground, 30s timeouts):

- `node --import ./tests/register.mjs --test tests/editorial-card-indices.test.mjs tests/esim-capability-cards.test.mjs tests/about-page-motion.test.mjs tests/process-stage-icons.test.mjs tests/page-component-entrances.test.mjs tests/esim-icons.test.mjs tests/esim-page.test.mjs`: RED 30/33 passed, with the three intended failures for missing eSIM prominence, About prominence and operational-card depth; GREEN 33/33 passed. Superseded tiny-HUD/old paint-transition assertions were replaced with positive editorial/gradient/paint-transition contracts; existing content, grid, gesture, sizing, CTA, disabled-state and entrance checks pass.
- `node node_modules/typescript/bin/tsc -b`: passed without output.
- `git diff --check`: final observed result is reported in the writer handoff.

Rendered-page and CSS contracts are structural evidence, not visual proof. The parent read the actual scoped pages/CSS/tests and repeated the 33/33 focused checks successfully. Final combined parent verification passed 225/225 tests, lint and whitespace; production build passed for unchanged source. Browser appearance/pointer proof remains unavailable; the shared divider's independent execution limitation is recorded below. No native review operations were performed.

## Major section divider — single viewport shimmer

Only `SectionLabel` separators replace their old scale-from-zero draw with a stationary, always-visible full-width 1px baseline and a thin cyan light pass. The existing baseline Motion viewport trigger (`once: true`, `amount: 1`) drives inherited child variants: −100% to +100% over 1.35s, ease-in-out, with no repeat, autoplay or hover trigger. The shine has no observer or animation override of its own. Percentage travel needs no measurement, timers, new hooks or infrastructure; MotionConfig remains in control of Motion transforms.

Only the absolute decorative line clips the shine. Label/index/optional metadata, caller className, responsive text and spacing remain unchanged; the line remains ARIA-hidden, pointer-inert and unfocusable. Only reduced-motion CSS hides the shine, leaving the baseline visible. With a normal motion preference, the viewport-triggered pass also works on touch screens; it does not require hover. No other border, card, page, icon, illustration or scroll behavior was changed. The earlier audited CSS blocks were retained; divider-only CSS is appended.

Writer proof (foreground, 30s timeouts):

- `node --import ./tests/register.mjs --test tests/section-label-shimmer.test.mjs tests/page-component-entrances.test.mjs tests/editorial-card-indices.test.mjs tests/company-pages.test.mjs tests/process-scroll.test.mjs`: RED 31/34 passed, with three intended failures for the missing shine/viewport contract and divider CSS; GREEN 34/34 passed.
- `node node_modules/typescript/bin/tsc -b`: passed without output.
- `git diff --check`: final observed result is reported in the writer handoff.

Tests render the actual exported SectionLabel and capture narrowly scoped public Motion props, alongside CSS, page/content, editorial and scroll-geometry preservation checks. This is structural fixture evidence, not actual browser viewport/visual proof. Parent review removed the unintended touch-only suppression with RED/GREEN, then repeated 34/34 focused checks. Two full-suite expectations of the retired origin-left draw marker were updated to positively assert the fixed baseline and shine in eSIM and Estimator; 21/21 targeted checks passed. Final combined verification passed 225/225 tests, lint and whitespace; production build passed for the unchanged source. Browser appearance/playback remains unverified. Independent inspection passed statically with no source defect, but isolated scratch-copy preparation exceeded its 30s limit before tests produced output. Independent execution therefore remains unverified and was not retried; closure requires the user's decision on this partial proof. No ODD feature/S# locator was supplied for this divider unit; no native review was invoked.

## Checks

```bash
node --import ./tests/register.mjs --test tests/*.test.mjs
npm run build
npm run lint
```

The initial eSIM-specific focused run passed 19/19 tests and its full-candidate verification passed 164/164 tests, production build, lint and whitespace checks. The subsequent purchase/voucher badge refinement passed 18/18 focused tests and final verification passed 164/164 tests, production build, lint and whitespace checks. The first full run exposed an incomplete reduced-motion fixture in the geometry test; the new badge now uses that test's existing preference fixture, without changing production scroll behavior. Build warnings flag JavaScript chunks over 500 kB; before/after attribution was not measured. The new Header integration test uses the same scoped identity portal as the existing menu tests because Node SSR has no document.

Automated coverage checks rendered markup, navigation, parent-trigger CSS, motion fallbacks and confirmation wiring. It does not establish visual quality or browser behavior. Native assessment was unavailable because untracked files required an explicit declaration; no native review was started.

Before accepting the pilot, inspect desktop and mobile, keyboard focus, and operating-system reduced motion. Exercise success against a local mocked endpoint or use the WhatsApp handoff without sending a message; do not submit synthetic inquiries to production. Actual browser rendering and before/after bundle measurements remain unverified.
