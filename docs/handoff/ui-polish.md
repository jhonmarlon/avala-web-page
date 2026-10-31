# Resume the UI polish work

Continue on `feat/ui-polish-accessibility`, based on `feat/avala-group-web` at `c196a66`. The implementation is saved separately from the teammate's branch and the Wompi integration. Browser validation remains the next step; automated checks passed.

## Quick start

```bash
git switch feat/ui-polish-accessibility
npm run dev
```

Do not merge or publish a release without a separate decision. Local environment files were deliberately excluded from these commits.

## Saved work

| Area | Current behavior |
| --- | --- |
| Shared controls | Button merges styles and forwards link events/ARIA; mobile menu uses a native dialog, accessible close control and smooth exit. |
| Pointer | A 6px dot with a spring-following 20px ring; no oversized hover balloon. Touch/reduced-motion fall back to the native cursor. |
| Hero | Text above the centered globe on mobile; balanced desktop columns and a slightly larger desktop globe. No forced mobile viewport-height tail. |
| Typography | Restrained headings, 20–40px marquee text, smaller metrics, 16–24px contact values and 20–30px service labels. |
| Section rhythm | Approximately 48px mobile / 80px desktop combined outer spacing, with explicit decorative and pinned-process exceptions. |
| Continuation | Eight “Continuar” controls connect the Home sections in order. The final contact section has no continuation. |
| Process | All five stages traverse horizontally on desktop when the measured frame fits. Vertical fallback remains for mobile, reduced motion or genuinely short viewports. Vertical scroll budget is 0.45 times horizontal travel. |
| Cases | Compact image/copy grouping, soft one-time entrance and static four-edge image fade into the page, with unmasked case labels. |
| Loading/motion | Intro has no artificial 2.2s minimum. Font waiting is capped at 250ms; normal exit is 400ms. Marquee frame/scroll subscriptions suspend offscreen or while paused. |
| Scrolling | Lenis smoothing is 0.65s without increasing gesture distance. Native scrollbar uses the page palette and a forced-colors fallback. |

The shared service catalog now lives in `src/config/services.ts`; ContactForm,
Home Hero, Services and Marquee import it directly. Home marketing content remains
in `src/features/home/data/content.ts`, without a legacy catalog re-export.
Home and Contact import the unchanged Bogotá clock from
`src/components/ui/LocalClock.tsx`.

## Reusable title sizes

Home and Contact use shared typography tokens for their approved title sizes. This centralization preserves the approved formulas and appearance; publishing remains a separate step.

| Utility | Font size | Range at a 16px root | Line height | Current use |
| --- | --- | --- | --- | --- |
| `text-title-hero` | `clamp(2.75rem, 4.3vw, 4rem)` | 44–64px | 1.02 | Home h1 |
| `text-title-page` | `clamp(3.5rem, 6vw, 5.5rem)` | 56–88px | 1.02 | Contact h1 |

Defined in `src/index.css` using Tailwind 4 `@theme` text tokens and their `--line-height` companions. Use alongside `display-tight` to retain the display family, weight and tracking, for example `className="display-tight text-title-hero text-avala-paper"`. No separate leading utility is needed. Other headings and body/label/metric utilities are unchanged. Browser validation remains pending.

## Compact mobile navigation

`text-nav-mobile-item` is the opt-in main navigation role: `clamp(1.5rem,
4vw, 1.75rem)` (24–28px at a 16px root), shared by direct links and the
Soluciones accordion. Both retain `display-tight` and `leading-none`.
Submenu labels use `text-lg` (18px) with their existing tight leading;
12px descriptions, numbering, padding, controls and other text roles are unchanged.
Keep the custom text-size class outside `cn`'s merge so it is not mistaken for
and removed by a text-color class.

The focused SSR tests passed 2/2 after an intended missing-role RED; they cover
all five main labels and preserved collapsed markup/routes/controls. Compiled CSS
confirms the clamp, 18px utility and unchanged title/contact tokens. Expanded
submenu rendering, native dialog behavior, keyboard/focus and visual sizing still
need browser checks; the test-local portal identity stub does not exercise them.

## Contact values and opt-in image edges

`text-contact-value` is the reusable contact-detail role: `clamp(1rem, 2vw,
1.5rem)` (16–24px at a 16px root), with a 1.25 line-height companion.
Only the four channel values use it, alongside their existing `display-tight`,
`leading-tight` and wrapping utilities. Titles, HUD labels, IDs, destinations
and arrow sizes/hover behavior are unchanged.

Use `.image-edge-fade` on a stationary, transparent image viewport, not on a
moving or oversized image. Home Cases opts in with an `absolute inset-0`
wrapper around each parallax image; the figure retains its crop/aspect ratio
but no opaque background. Intersected horizontal/vertical alpha masks fade
all four edges over `clamp(16px, 3vw, 40px)`, leaving the center sharp and opaque.
Standard `mask-composite: intersect` has a WebKit `source-in` fallback.
Keep captions outside the masked wrapper so “Caso” stays fully readable.
There is no blur, overlay, new animation or global image treatment; existing
entrance, parallax, reduced-motion handling and hover grayscale remain.
Browser checks for edge quality, mobile wrapping and label readability remain pending.

## Opt-in outline buttons

Use the shared `Button` with `variant="outline"` for quiet, dark actions:

```tsx
<Button variant="outline" onClick={handleAction}>Continuar</Button>
<Button variant="outline" href="https://example.com" target="_blank">Visitar</Button>
<Button variant="outline" to="/contacto">Contacto</Button>
```

The reusable family owns ink background, paper text/thin border, barely rounded
corners, 44px minimum height, subtle neon-blue hover, visible keyboard focus and
reduced-motion transitions. Existing primary, secondary and ghost styles remain
unchanged; other buttons are not migrated automatically.

The footer now uses this family for “Hablemos por WhatsApp”, preserving its number
and new-tab behavior. Only the decorative icon owns a green accent (`text-green-400`),
without a circle, gradient or glow; WhatsApp is not a separate button variant.
Browser checks for hover, keyboard focus, contrast and mobile wrapping remain pending.

For icon-only actions, keep the same color family and opt into square sizing:

```tsx
<Button variant="outline" size="icon" href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
  <Icon aria-hidden="true" className="size-4" />
</Button>
```

`size="icon"` owns 44×44px geometry, zero padding and no shrinking; it is not a
social-specific color variant. The three footer socials use this combination.
The footer retains its background image with a stronger 92–95% dark overlay;
text, logo, columns and destinations are unchanged, without whole-footer opacity.

## Shared form actions

`src/components/ui/Button.tsx` owns generic Contact and Estimator actions.
Estimator no longer defines `estimatorStyles.button` or `buttonSecondary`:
use `variant="neon"` for its square solid action and `variant="neonSecondary"`
for its transparent secondary action. These preserve the existing 44px minimum,
16px text, neon focus, disabled opacity and reduced-motion styling.

Contact uses `editorialSolid`, `editorialLine` and `editorialBare`, with
`size={null}` to opt out of the default minimum-height sizing. The editorial
family retains Contact's mono typography, native focus/disabled behavior and
300ms color transitions rather than inheriting the legacy rounded family.
Its solid action is 56px high; line/bare actions are 48px high. Contact's
WhatsApp line action keeps its local 56px height, padding, icon gap and disabled
opacity override; submit keeps its responsive minimum width. Labels, children,
explicit native types, loading/disabled props and callbacks stay at each caller.
Selection chips and Estimator options remain domain-owned native controls.

```tsx
<Button type="button" variant="neon" onClick={handleNext}>Siguiente paso</Button>
<Button type="submit" variant="editorialSolid" size={null} disabled={sending}>
  {sending ? 'Enviando…' : 'Enviar mensaje'}
</Button>
```

The native-button branch accepts `ComponentPropsWithRef<'button'>`. With the
installed React 19, its ref prop passes directly to the native button, without
casts, wrappers or a new focus target. The modal close action uses
`variant="neonSecondary" size="icon"`, keeping its existing ref, 44px square and
150ms color transition. Its Escape listener, focus trap, initial focus,
restoration, scroll lock and all controller effects are unchanged.

Primary, secondary, ghost, outline and icon defaults remain unchanged for
existing consumers. The new variants are opt-in; native anchors retain the
existing external-rel protection. `CtaLink` is unchanged: its animated label and
native/router navigation contract are not form-action abstractions.

New variant tests observed missing-family RED failures, and the real modal
consumer produced a compiler RED for its missing ref prop before the type fix.
Ref forwarding already worked at runtime; that check was GREEN before the fix.
SSR and bounded element/prop checks cover labels, native types, geometry tokens,
disabled/loading states, callback identity and ref passthrough. They do not prove
browser focus, keyboard dispatch, visual equivalence or full submission/reset.
No real API, WhatsApp or checkout requests were made.

## Continuation indicator motion

Only the blue 12px segment moves vertically inside its stationary 24px rail,
using the opt-in `motion-safe:animate-section-continue` utility. The 1.9s
CSS-only ease-in-out cycle returns to the original bottom position. Reduced
motion keeps that original static segment. Text, focus, 44px minimum target
and measured-header scrolling remain unchanged. Compiled CSS confirms the
keyframes and no-preference media guard; browser playback remains unverified.

## Opt-in form styles

Contact and Estimator share `formStyles` from `src/components/ui/form-styles.ts`.
Use `className={formStyles.input}` on native inputs, selects or textareas and
`formStyles.label` on labels. Merge layout classes with `cn`; for invalid fields,
merge `formStyles.inputError` and render `formStyles.error` in normal flow with
an associated error ID. Estimator aliases these tokens through `estimatorStyles`.

The controls retain Estimator's ink background, full border, 16px body text,
neon focus ring and forced-colors-aware autofill treatment. Autofill explicitly
keeps a 1px border: muted when unfocused, neon when focused and red when invalid.
The separate keyboard focus ring remains visible; forced colors use system
rendering. Other routes must opt in explicitly. Browser checks for autofill,
focus and wrapping errors remain pending; SSR does not exercise Contact
submission, WhatsApp or success/error transitions.

Contact channel arrow boxes keep their ink background and original border during
hover/press, while the arrow changes from paper to neon blue. From the small
breakpoint up, the tile is 56px and the icon is 28px to match the supplied diamond
reference; mobile retains the compact 40px/16px sizes. Hover rotation and the
row's neon fill remain unchanged.

## Shared country picker and proposal modal

Contact and Estimator reuse the same `PhoneField` and `CountryCodeSelect`,
from `src/components/ui/phone/`, with the unchanged country catalog, types,
constants, `sanitizePhoneDigits`, `composePhone`, `isValidNationalPhone` and
`searchPhoneCountries` owned by `src/lib/phone.ts`. Optional identity,
name and label props let Contact retain its unique control/error IDs and numbered
optional label; existing Estimator defaults are unchanged. Contact validates the
national draft and adds the selected dialing prefix only when constructing the
existing API payload or WhatsApp message. Empty phone remains optional, leading
zeros are retained, and changing countries does not replace the national draft.
Contact's successful reset restores Colombia and an empty draft; validation or
submission failure does not reset the selection. Other fields, interests,
anti-bot metadata and delivery flow remain unchanged.

The phone row reserves 7rem (8.5rem on larger screens) for a compact ISO/prefix
button, for example `CO +57`; the national number takes the remaining width.
Its grid bottom-aligns the two control columns with matching sizing classes, so
single-line or wrapping optional labels do not offset the controls. Errors remain
below the pair. Pixel alignment and mobile wrapping still need browser checks.
Opening the picker focuses a search field accepting country names, ISO codes or
dialing prefixes, ignoring case and accents. The same 24 countries remain
available, with Colombia selected by default and shared prefixes kept distinct.
Choosing a country does not replace the national-number draft.

The bounded dark results panel stays in normal flow inside the dialog, with its
own palette-matched scrollbar (`formStyles.countryList`). Arrow keys, Home/End
and Enter navigate/select; Escape closes just the picker and restores its
trigger. Tab or an outside click dismisses it without trapping focus. These
interactive behaviors still need real browser verification.

The proposal modal uses a 450ms fade, 28px upward entry and subtle scale from
0.97, with a lighter exit. Reduced motion removes translation/scale and keeps
an almost immediate fade. The Home eSIM schematic now follows
`01 Perfil → 02 Compra → 03 QR → 04 Activa`; its timing is unchanged.

## eSIM page: corrected Home/Contact composition

The first ink/paper pass retained the old hero/sidebar and boxed stacks; it did
not adequately follow Home/Contact. `/esim` now has a full-width editorial header:
`SectionLabel`, white/neon `SplitReveal` headline and a masked grid backdrop.
The long headline retains `text-title-hero` (44–64px). Intro and benefits sit below
its thin separator; the four protected steps follow as compact numbered rows,
not a large boxed aside. Five `Section` containers use `withSpacing={false}` with
explicit editorial spacing; capabilities and flow choices use flat ruled rows.
No nested page container, main, new illustration or global style was added.

Active actions reuse Home/Contact's `CtaLink`: purchase is solid, Contact is line.
The voucher preview uses the shared outline `Button`, natively disabled with
`type="button"` and the label “Disponible próximamente”: no activation href,
click handler or keyboard tab stop. Flow headings/descriptions remain siblings
of the controls. `CtaLink` accepts exactly one of `to` or native `href`:
`<CtaLink href={esimExperienceLinks.buy}>Comprar eSIM</CtaLink>`.
Existing `to`, variants, string labels, cursor, classes and click forwarding remain;
native links keep the URL, same tab and no router discovery attribute. Content is
shared between branches. Reduced-motion CSS keeps the first label stationary,
hides its decorative duplicate and stops arrow rotation; normal styling remains.
The page retains `MotionConfig reducedMotion="user"` for shared reveal/label motion.

The editorial copy, five sections, four ordered steps and six capabilities remain;
only the voucher button label/availability and purchase destination changed by
explicit product decision. Exactly two active anchors remain: purchase goes to
`https://siembradigital.avalashop.com/` (exact root, same tab), and Contact keeps
router `to="/contacto"`. The central `esimExperienceLinks.buy` is pinned to that
URL independently of `VITE_ESIM_PWA_URL`; the config object shape, activation
property and all other configuration remain unchanged. No activation route,
checkout, OTP, payment or backend implementation changed; real checkout was not
opened or verified. No launch date is promised.

Focused eSIM SSR tests passed 3/3 after intended wrong-destination and
missing-disabled-control RED failures (plus the superseded active-link styling
assertion). One overbroad nested-anchor assertion was corrected before GREEN.
The suite passed 66/66, including the parent's shared CtaLink hover-guard test;
lint and the environment-safe build passed. The >500 kB warning remains.
Mobile wrapping, keyboard behavior, contrast and reduced-motion playback still
require browser checks. SSR is not browser proof.

Independent read-only verification found no blockers in the existing Home/Contact
`to` contract, native purchase URL, disabled voucher state or motion-safe guards.
Its focused seven-test run and whitespace checks passed; no browser or checkout
proof, native review approval or delivery authorization is implied.

## Protected eSIM step effects

Only the four “Flujo protegido” steps reuse Home Services' bottom-up blue fill
through `src/components/fx/RowHoverFill.tsx`. Its parent must own `group`,
`relative`, `isolate` and `overflow-hidden`; the span is decorative and
pointer-inert. Home Services and the eSIM steps are its only callers. Home's
normal hover classes, links and pointer preview remain unchanged.

Each informational `li` contains the existing shared `Reveal` (one-time viewport
entry, 0.06s stagger). Copy is never hover-gated and remains readable on touch;
hover changes number/title/icon to ink and description to ink/80. Only motion-safe
hover shifts the title. Reduced motion uses static visible Reveal variants and
instant fill/color changes, without entry translation or title movement. The
canonical purchase URL, two active anchors and disabled voucher are unchanged.

Focused SSR passed 6/6 after the intended missing-wrapper/fill RED; the full suite
passed 69/69. SSR checks preserve Home's normal markup, semantic ordered steps,
copy and native CTA states. No browser hover/playback or server reduced-motion
mock was exercised; reduced-motion handling is structurally guarded, not browser
proof. Mobile geometry, contrast and one-time entrance still need browser checks.

## Commit slices

- `2b0c0ce` — shared controls, pointer and mobile navigation.
- `6b91bde` — shorter preloader and lifecycle tests.
- `6869200` — offscreen motion, responsive scrolling and shared styles.
- `07a1bcd` — responsive Home presentation, section navigation and Process tests.

These are dependent slices of the completed work; review the final branch together.

## Verification evidence

The final implementation passed:

```bash
node --import ./tests/register.mjs --test tests/*.test.mjs
node ./node_modules/typescript/bin/tsc -b
node --input-type=module -e "import { build } from 'vite'; await build({ envDir: false })"
npm run lint
git diff --check
```

There are 69 passing tests (including four shared CtaLink tests, five eSIM/Home SSR tests and one shared row-fill test covering protected-step effects, Home hover preservation, the corrected composition, preserved content, canonical purchase root and disabled voucher preview, alongside mobile navigation typography, contact values, Cases image fading, shared international phone, autofill states and phone-row alignment). The Node test loader uses the already-installed TypeScript package; no dependencies were added. The previous lint timeout was explicitly retried with authorization and resolved.

For the latest contact-value/image-edge unit, focused tests passed 4/4 after
observing two intended RED failures, the full suite passed 54/54 and lint passed.
The latest build passed using the explicitly authorized environment-safe equivalent
below, rather than `npm run build`, so Vite did not load local environment files:

```bash
node ./node_modules/typescript/bin/tsc -b && node --input-type=module -e "import { build } from 'vite'; await build({ envDir: false })"
```

Compiled CSS inspection confirmed the contact clamp/line-height utility, both
four-edge gradients, the 16–40px ramp and standard/WebKit intersection composition.
The existing >500 kB chunk warning remains. These checks are not browser proof.

The mobile typography unit also passed the full 59-test suite, lint, whitespace
check and the environment-safe combined build above; the >500 kB warning remains.

The current production-build check uses Vite's `envDir: false` override to avoid
loading local environment files; project scripts/configuration are unchanged.

Known limits:

- Build still warns about chunks larger than 500 kB. No FPS, LCP or INP improvement was measured.
- Browser automation was unavailable. Mocked lifecycle/geometry and server-render tests do not prove real layout, focus or scroll behavior.
- Native review was not completed: assessment could not resolve the intended untracked-file scope. No native approval is claimed.
- `.env.development` and `.env.production` remain local and untracked. Do not add them.

## First checks tomorrow

- [ ] At 1366×720 and 1440×768, traverse Process through 05/05, resize and confirm a compact release into Cases.
- [ ] Check short viewports, zoom and reduced motion: all five stages must stay readable and the layout must recover after resizing.
- [ ] Follow every “Continuar”; headings should land below the sticky header, with no control in the final section.
- [ ] Check mobile menu Tab/Shift+Tab, Escape, close animation, focus restoration and breakpoint changes.
- [ ] Confirm mobile contact/service wrapping, Cases image fades and section gaps, especially Cases → Products → Contact.
- [ ] Check marquee pause persistence across viewport exit/re-entry and the brief intro in a fresh session.
- [ ] In the Estimator modal, test country search, keyboard navigation, empty results, selection/Escape focus, Tab, scrollbar and short/mobile viewports; confirm draft/reset and reduced-motion transitions.

## Decisions still open

Simplifying the marquee to one horizontal band and removing the “Qué hacemos” watermark remain recommendations only, not implemented. Cases image-edge fading is now implemented as the opt-in utility described above. Further Process entry redesign, route-placeholder completion and additional performance changes also need a scoped decision.

Wompi remains on `feat/esim-business-section` at `7714f19`; it was not merged into this branch.
