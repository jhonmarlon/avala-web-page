# Frontend style and icon families refactor
Scope: the current frontend only; preserve its approved presentation and behavior. Server, dependencies, environment files and publishing are excluded.
Baseline: current dirty tree on `feat/icon-microinteractions`, not HEAD; local checkpoint and reviewable refactor commits authorized.

## Specs

- S1: "cvrar familias de estilos e iconos reutiliazbles"
- S2: "limpiar codigo muerto"
- S3: "organizar todo el code"
- S4: "sin romper nada funcional."
- S5: "Frontend completo (recomendado)" — "Estilos, íconos, componentes y organización de funcionalidades; limpiar código muerto comprobado. Sin tocar servidor ni dependencias."
- S6: "Commit local de la base (recomendado)" — "Guardar los cambios actuales de UI, pruebas y documentación. Después, refactorizar en commits pequeños verificables. Sin push ni publicación."

## Tasks

- T1 | S4,S6 | parent Git authority | done | commit: 77137972fda639e7cc2cfcc9990a154c155c752c | Approved archival checkpoint: 45 UI/test/license/handoff paths; private environments and this feature document excluded. Existing 254/254/build/lint/diff proof applies to unchanged source.
- T2 | S1,S3-S5 | two disjoint bounded writers + parent seam checks | in_progress | commits: pending | U1 establish ordered style foundations and location-independent CSS checks; U2 share the decorative SVG frame without changing output, IDs, replay or public imports.
- T3 | S1,S3-S5 | bounded writer + parent checks | pending | commits: pending | Organize the remaining actual style families in ordered, reviewable slices; preserve every declaration, layer, breakpoint and cascade.
- T4 | S1,S3-S5 | bounded writer + parent checks | pending | commits: pending | Organize compact scene implementations by genuine family while retaining root exports, material IDs, geometry, actors and hover behavior.
- T5 | S2-S5 | bounded frontend inventory + scoped cleanup | pending | commits: pending | Check all client ownership/reachability and remove only proven dead code; make remaining organization changes only where evidence justifies them, never gratuitous renames or a universal framework.
- T6 | S3-S6 | parent functional checks/documentation | pending | commit: pending | Verify integrated regressions, typecheck, environment-isolated build, lint and whitespace; document family ownership, actual limitations and all work-unit commits.

## Log

- L1: Original request verbatim: "Ahora neceisto que pulamos nuestro code, cvrar familias de estilos e iconos reutiliazbles, limpiar codigo muerto y organizar todo el code sin romper nada funcional."
- L2: User selected "Frontend completo (recomendado)" with the S5 description; backend/dependencies are outside this feature.
- L3: User selected "Commit local de la base (recomendado)" with the S6 description; local checkpoint and subsequent small commits are authorized, no push/PR/merge/deployment.
- L4: Initial index has no staged work. Current tree contains 26 modified tracked paths plus new icon/fx/test/license/handoff paths. Preserve these approved changes as the archival baseline, distinct from newly authored refactor work. Last unchanged-source verification: job-18 passed 254/254 tests, production build, lint and whitespace. No browser appearance/focus/full submission proof is claimed.
- L5: Read-only scout mw42mevd-d-v4re returned only an acknowledgement, not a usable audit. No findings are inferred, and no automatic retry is planned. Parent bounded read confirms index.css owns tokens, base and later UI/motion families; multiple tests read that physical file directly; SequenceIllustration and EsimFlowIllustration duplicate decorative SVG root/replay policy. These are concrete starting seams, not a claim that every module needs refactoring.
- L6: Existing shared-ui-consolidation and repository-consolidation trackers are complete, not interrupted work. Reuse their established neutral feature/domain owners; do not redo their phone/catalog/clock/action consolidations. Existing repository policy uses `envDir: false` for verification builds; do not read or load local environment files. Native assessment has historically been unavailable for undeclared untracked scope; no approval exists.
- L8: T1 archived the expressly approved prior work in 77137972fda639e7cc2cfcc9990a154c155c752c (45 paths, 2,790 additions / 144 deletions). Staged whitespace passed; source matched the previously verified 254-test candidate. Native assessment remained unavailable for undeclared untracked scope; no approval claimed. Only this feature document remains outside the checkpoint. No environment files, server changes or remote operations were included.
- L7: Pure structure-preserving moves use green characterization before and after, not artificial RED. New behavior is not requested. Each writer reads this document through `## Log`, reports covered S# and returns actual focused evidence. Roughly 400 authored diff lines per coherent new work unit is advisory; the expressly authorized archival checkpoint is prior work, not a new refactor unit. Preserve licenses and dependencies; check direct/dynamic imports, configuration, public consumers and tests before deleting candidates.
