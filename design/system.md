# Avala eSIM — source-backed design system

Synced from local sources; not a proposed starter. Use the dark eSIM palette for these previews, not the legacy white ServiceCard treatment. Production source remains read-only.

## Sources and counts

- `src/index.css`: theme, semantic colors, utilities and layouts.
- `src/components/ui/Card.tsx`: neutral card primitive.
- `src/features/home/components/ServiceCard.tsx`: legacy service-card composition.
- `src/pages/EsimPage.tsx`: current dark section, exact content and layout.
- `node_modules/tailwindcss/theme.css`: utility spacing, type, breakpoint and selected rounded-lg resolution.

Inventory: 31 named color entries (8 Avala + 9 brand/surface + 14 light/dark semantic); 4 font stacks; 4 custom type sizes + 7 relevant utility sizes + 2 typography rules; 12 spacing steps; 4 original radii + 1 selected opt-in radius; 3 shadow recipes; 6 component rules. Component-local decorative colors are documented separately, not counted as named palette entries.

## Colors

All entries in this table come from `src/index.css`.

| Token | Value | Usage |
| --- | --- | --- |
| avala-ink | #05081a | eSIM canvas |
| avala-ink-2 | #0a1030 | Deep blue surface |
| avala-paper | #eef2ff | eSIM readable text |
| avala-mute | #8a93b5 | HUD / secondary text |
| avala-neon | #2fb8ff | Accent and focus |
| avala-gold | #d4a94f | Available brand accent; not used for eSIM cards |
| avala-cyan | #3fd0ff | Available bright accent |
| avala-violet | #7b5cff | Available violet accent |
| brand-50 | #eef6ff | Legacy light brand |
| brand-100 | #d9ebff | Legacy light brand |
| brand-400 | #2bb3ff | Brand accent / glow |
| brand-500 | #1298ff | Brand accent |
| brand-700 | #0b63d1 | Scrollbar |
| surface-50 | #f8fbff | Light surface |
| surface-100 | #eef3fb | Light surface |
| surface-900 | #071226 | Deep surface |
| surface-950 | #030814 | Deepest surface |
| light.background | #ffffff | Base canvas |
| light.foreground | #0f172a | Base text |
| light.muted | #f8fbff | Muted surface |
| light.muted-foreground | #475569 | Secondary text |
| light.card | #ffffff | Default Card |
| light.card-foreground | #0f172a | Default Card text |
| light.border | #dbe5f2 | Base border |
| dark.background | #030814 | Dark base |
| dark.foreground | #e2e8f0 | Dark text |
| dark.muted | #071226 | Dark muted surface |
| dark.muted-foreground | #94a3b8 | Dark secondary text |
| dark.card | #081427 | Dark card |
| dark.card-foreground | #f8fafc | Dark card text |
| dark.border | rgba(148, 163, 184, 0.18) | Dark border |

Source-derived compositions: eSIM uses paper/15 borders and paper/75 text; `panel-dark-glass` uses white/10 border, white/5 fill and white text. White is #ffffff above. Previews compose these existing colors with opacity (including neon/45 border, neon/10 hover fill and neon/5 featured fill); these are preview compositions, not new brand tokens. Transparent/currentColor are CSS primitives. Decorative low-contrast borders never convey required meaning alone.

## Typography

Original tokens from `src/index.css` (recorded, never requested by standalone previews):

| Token | Original stack |
| --- | --- |
| font-sans | Inter, system-ui, sans-serif |
| font-heading | Manrope, Inter, system-ui, sans-serif |
| font-display | 'Inter Tight', Inter, system-ui, sans-serif |
| font-mono | 'JetBrains Mono', ui-monospace, monospace |

**Preview fallback mapping:** sans, heading and display → `system-ui, sans-serif`; mono → `ui-monospace, monospace`. These are the original stacks' own fallbacks. Every HTML file uses only these families, with no font imports or requests. Fallback glyph metrics differ from production.

Custom sizes, `src/index.css`: title-hero `clamp(2.75rem, 4.3vw, 4rem)` / 1.02; title-page `clamp(3.5rem, 6vw, 5.5rem)` / 1.02; contact-value `clamp(1rem, 2vw, 1.5rem)` / 1.25; nav-mobile-item `clamp(1.5rem, 4vw, 1.75rem)`.

Relevant utility sizes from `node_modules/tailwindcss/theme.css`, used in the read components: xs .75rem; sm .875rem; base 1rem; lg 1.125rem; xl 1.25rem; 2xl 1.5rem; 3xl 1.875rem. eSIM paragraph line-height 2rem, capability line-height 1.75rem (`src/pages/EsimPage.tsx`).

Two rules from `src/index.css`: HUD = .75rem, mono, uppercase, line-height 1.5, tracking .14em, mute; display-tight = display stack, weight 600, tracking -.055em. Previews use these rules with the fallback mapping.

## Spacing and responsive layout

`node_modules/tailwindcss/theme.css`: spacing unit .25rem. Relevant steps found in read sources: 1=.25rem, 2=.5rem, 3=.75rem, 4=1rem, 5=1.25rem, 6=1.5rem, 8=2rem, 10=2.5rem, 12=3rem, 16=4rem, 20=5rem, 24=6rem (12 steps).

`src/index.css`: page-container max 1280px, horizontal padding 1rem / 1.5rem / 2rem; section-spacing 4rem / 6rem; home spacing 1.5rem / 2.5rem. `src/pages/EsimPage.tsx`: operation gap 2.5rem, intro .85fr / cards 1.15fr at lg, existing cards two columns from sm. Tailwind sm=40rem and lg=64rem from theme.css. Preview grids use these breakpoints and collapse at small widths; no fixed-height clipping.

## Radius and shadows

| Rule | Exact value | Source |
| --- | --- | --- |
| radius-5xl / Card | 2.5rem (40px at default root) | `src/index.css`, `src/components/ui/Card.tsx` |
| panel-muted | 2rem | `src/index.css` |
| ServiceCard | 1.35rem | `src/features/home/components/ServiceCard.tsx` |
| ServiceCard icon | 1rem | `src/features/home/components/ServiceCard.tsx` |
| Selected uniform / ink Card (`rounded-lg`) | .5rem (8px at default root) | `node_modules/tailwindcss/theme.css`: `--radius-lg: 0.5rem`; `src/components/ui/Card.tsx` |
| shadow-soft | 0 18px 60px rgba(7, 18, 38, 0.12) | `src/index.css` |
| shadow-glow | 0 0 0 1px rgba(43, 179, 255, 0.18), 0 20px 80px rgba(18, 152, 255, 0.16) | `src/index.css` |
| ServiceCard shadow | 0 16px 45px rgba(7,18,38,0.08) | `src/features/home/components/ServiceCard.tsx` |

## Component rules

1. **Neutral Card:** `src/components/ui/Card.tsx` composes panel-surface + p-8 + 200ms transform transition and accepts className/HTML attributes. Default light semantic card is not the modern eSIM appearance. The opt-in `surface="ink"` reuses the primitive with dark fill, paper/15 border and `rounded-lg` (8px); legacy defaults remain unchanged. Selected artboard 01 follows this radius; alternatives retain their original radii.
2. **Legacy ServiceCard:** `src/features/home/components/ServiceCard.tsx` uses 1.35rem radius, p-4 / lg:p-5, icon radius 1rem, light gradients and CTA arrow. Featured gradient rgba(239,247,255,.95) to white; ordinary white to rgba(247,250,255,.95); border #dfe8f6; title #16213d; CTA #2a55ff. Record only; do not apply this white treatment to eSIM.
3. **Dark glass:** `src/index.css` panel-dark-glass uses 2.5rem radius, white/10 border, white/5 fill, white text, exact glow shadow, backdrop-blur-sm. Alternative compact cards retain the existing 1.35rem radius and dark visual language, not ServiceCard's light fill. Selected uniform cards use the source-backed 8px rule above; original four radii remain valid for their sources/alternatives.
4. **Lift:** `src/index.css` interactive-lift is translateY(-4px), 300ms. Previews restrict feedback to `(any-hover: hover)` and disable movement/transitions under reduced motion. Passive cards have no pointer cursor, fake button or tab stop.
5. **eSIM section:** `src/pages/EsimPage.tsx` section 04 preserves the editorial heading, paragraph, and all six capability sentences in source order. Uniform grid keeps all text visible; bento emphasizes the final traceability card without DOM reordering.
6. **Disclosure alternative:** preview-only native details/summary, first open, descriptive short summary, exact original body, visible neon focus ring, generous touch target. Collapsing is intentional; no fabricated operational detail. Other cards are not controls.

## Preview self-check

All four HTML boards use only the named colors above or documented opacity compositions, exact recorded shadows, and the two fallback font stacks. No remote dependencies. Review at 1440×900 and 320px before implementation; structural checks are not browser or pixel verification.
