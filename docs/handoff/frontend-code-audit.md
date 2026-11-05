# Frontend reachability and safe cleanup

T5 / S2–S5: four retired, feature-specific Home modules were removed after checking the complete client graph, tests, configuration and availability intent. The browser-entry graph retains **84 reachable modules**, while total TS/TSX modules fall from **92 to 88**. No active view, data export, stylesheet, dependency or server behavior was rewritten.

## Removed and retained

| Disposition | Module | Evidence |
| --- | --- | --- |
| Removed | `src/features/home/components/ServiceCard.tsx` | No source/test import, re-export or loader; the active Home and Solutions catalogs use their current row renderers. Historical radius documentation was not a current availability promise. |
| Removed | `src/features/home/components/SuccessCaseCard.tsx` | No source/test consumer or configuration loader; published Home/Cases rows do not use this former light card. |
| Removed | `src/features/home/components/ProcessStepCard.tsx` | No source/test consumer, dynamic loader or current availability contract. `ProcessSection` uses the shared `NumberedStepSequence`. |
| Removed | `src/features/home/sections/AboutSection.tsx` | No source/test consumer or availability contract. `HomePage` composes `ManifestoSection` instead. Its shared imports were not recursively deleted. |
| Retained compatibility | `src/components/icons/TerminalIcon.tsx` | `docs/handoff/icon-microinteractions.md:86` explicitly keeps the reusable helper available, and `tests/icon-pilot.test.mjs` pins its behavior. Production unreachability is not permission to break that promise. All terminal CSS/tests and the MIT notice remain. |
| Retained compatibility | `src/components/ui/LegacyPlaceholderPage.tsx` | `tests/shared-ui-contracts.test.mjs:69–76` explicitly preserves availability without binding modern routes to the primitive. |
| Retained reusable primitive | `src/components/ui/Heading.tsx` | A shared UI primitive, previously consumed by the retired About section, not demonstrated obsolete merely because the app graph does not currently reach it. |
| Retained reusable wrapper | `src/components/fx/Magnetic.tsx` | A general pointer wrapper with no current consumer; obsolete intent is not established. No blind public-utility pruning. |

The four removed paths and their former declaration locations are recorded in the pre-cleanup AST evidence and Git history at `1510bd8`; they are not current source links. The two original card removals were proven by the worker; the parent additionally checked all source/test/document references and intent for ProcessStepCard/AboutSection, then performed the four narrowly scoped deletions. Source files had no pre-existing local edits before removal.

`Card` is live in `src/pages/EsimPage.tsx` and remains untouched. **`aboutSectionContent` remains live** in Manifesto/other views and characterization tests; deleting the old section did not authorize deleting its shared data. Phone, catalog, clock, shared actions and other existing neutral owners remain unchanged.

## Audit coverage

The development-only TypeScript AST inventory is in ignored `node_modules/.cache/frontend-families-7713797/dead-code-audit/graph.mjs`. `graph-before.json` records the original 92 modules, exported declarations, consumers and import/re-export edges; `graph-after.json` records the actual cleanup. These fixtures are not application or committed-test dependencies.

| Measure | Before | After |
| --- | ---: | ---: |
| TS/TSX modules | 92 | 88 |
| Main-entry reachable | 84 | 84 |
| Outside entry graph | 8 | 4 retained intentionally |
| Client import/re-export edges, including packages/assets | 370 | 352 |
| Declaration-level type-only edges | 32 | 31 |
| Source assets inventoried | 17 | 17 |
| Production dynamic imports | 1 | 1 |
| Unknown production imports | 0 | 0 |

The inventory reads all `src/**/*.ts(x)` modules and 52 test/helper `.mjs` files, not stale codegraph metadata. It resolves `@/`, relative extensions and directory-index modules; declaration-level type-only edges count toward reachability. Inline type specifiers are represented by their containing import edge. This is module-level reachability, not a claim that every exported symbol has a production consumer.

- Entry: `index.html:12` → `src/main.tsx:5` → `src/app/router/index.tsx:1–12`; `PublicLayout` owns shared chrome/navigation and the router covers the current pages, including the shared coming-soon view.
- Sole runtime import: `src/features/home/sections/HeroSection.tsx:14` → `GlobeCanvas.tsx`, behind React.lazy. It remains reachable and retained.
- No production `import.meta.glob`/globEager, require loader or nonliteral import expression was found. The source `new URL` occurrence parses the WhatsApp URL; it is not a module loader.
- One syntactically nonliteral test import is a closed four-page configuration in `tests/page-component-entrances.test.mjs`; those pages are already reachable.
- Checked configuration: `vite.config.ts`, `tsconfig.app.json`, private `package.json` without an exports manifest, `eslint.config.js` and `index.html`. None registers a removed module. No environment file was read or loaded.
- CSS owns ordered theme, base, utilities, process-icon, illustration, effect and editorial families. Its entry is import-only; `tests/style-source.mjs` preserves ordered expansion for tests. No selector, cascade, replay alias, guard, geometry or hover value changed in this cleanup.

Six source assets have no TS import edge: `background_1.png`, `background_2.png`, `background_projects_price.png`, `hero.png`, `react.svg`, `vite.svg`. They remain **uncertain and retained** because CSS/public-path/design/tooling references require a separate asset audit. Assets, generated Tailwind output, external packages and server modules are not inferred dead from this TS graph.

## Actual post-cleanup verification

The same ignored `render.mjs` script captures and compares real public React SSR with MemoryRouter, fixed Date `2026-01-02T02:04:09.000Z`, inert fixture images and the existing empty env-source stub. Baseline expectations were not changed after deletion.

| Active page | Exact unchanged HTML length |
| --- | ---: |
| Home | 124586 |
| Solutions | 47817 |
| Cases | 12611 |
| eSIM | 71432 |

After all four deletions:

- `node node_modules/.cache/frontend-families-7713797/dead-code-audit/graph.mjs after`: **88 total / 84 reachable**, four retained primitives, unchanged live dynamic import.
- `node --import ./tests/register.mjs node_modules/.cache/frontend-families-7713797/dead-code-audit/render.mjs after`: **exact four-page equality** against the pre-cleanup strings.
- The original compatibility guard still passes **all ordered authored CSS and 30 exact SVG renders**. No expected CSS deletion exception or golden-baseline rewrite was necessary.
- Focused icon-pilot/shared-UI/company-page/eSIM checks passed **24/24**, preserving native links, current content/order, disabled voucher, confirmation motion and explicit compatibility availability.
- Full integrated job-25 passed **293/293 tests**, TypeScript, the environment-isolated production build, lint and whitespace (all exit 0). No active test was removed. Generated CSS fell from 123.10 kB to 117.26 kB after unused class sources were removed; authored CSS remains unchanged. The existing >500 kB JavaScript chunk warning remains.

No meaningful RED applies to removing unused modules; characterization stayed green. No active test was deleted or weakened. This is actual post-deletion SSR/source evidence, not browser pixel/focus/animation, completed WebGL/preloader or full submission proof. No real storage or API request was used. The earlier fallback correction's accepted **0/32 independent-execution limitation** remains explicit and is not turned into independent or native approval. All Git actions and final closure remain parent-owned.
