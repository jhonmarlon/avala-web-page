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
| Typography | Restrained headings, 20–40px marquee text, smaller metrics, 18–32px contact values and 20–30px service labels. |
| Section rhythm | Approximately 48px mobile / 80px desktop combined outer spacing, with explicit decorative and pinned-process exceptions. |
| Continuation | Eight “Continuar” controls connect the Home sections in order. The final contact section has no continuation. |
| Process | All five stages traverse horizontally on desktop when the measured frame fits. Vertical fallback remains for mobile, reduced motion or genuinely short viewports. Vertical scroll budget is 0.45 times horizontal travel. |
| Cases | Compact image/copy grouping, soft one-time image fade and close transition after Process. |
| Loading/motion | Intro has no artificial 2.2s minimum. Font waiting is capped at 250ms; normal exit is 400ms. Marquee frame/scroll subscriptions suspend offscreen or while paused. |
| Scrolling | Lenis smoothing is 0.65s without increasing gesture distance. Native scrollbar uses the page palette and a forced-colors fallback. |

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
npm run build
npm run lint
git diff --check
```

There are 21 passing tests. The Node test loader uses the already-installed TypeScript package; no dependencies were added. The previous lint timeout was explicitly retried with authorization and resolved.

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

## Decisions still open

Simplifying the marquee to one horizontal band and removing the “Qué hacemos” watermark were recommendations only, not implemented. Further Process entry redesign, route-placeholder completion and additional performance changes also need a scoped decision.

Wompi remains on `feat/esim-business-section` at `7714f19`; it was not merged into this branch.
