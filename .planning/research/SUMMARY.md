# Project Research Summary

**Project:** tsParticles Angular Workspace
**Domain:** Angular/Ionic wrapper monorepo modernization + tsParticles v4 beta adoption
**Researched:** 2026-04-10
**Confidence:** HIGH

## Executive Summary

This is a library-and-demo workspace, not an app product: success depends on publishing reliable Angular wrapper packages and proving them in realistic Angular and Ionic integrations. Across all four research streams, the strongest consensus is to prioritize deterministic modernization over ambitious feature redesign. That means adopting a strict toolchain baseline (Angular 21.2.x, ng-packagr 21.x, pnpm/Nx workflow), enforcing APF-compliant package outputs, and validating behavior in both `apps/angular-demo` and `apps/ionic-demo`.

The recommended delivery strategy is phase-driven and dependency-first. Start by locking semver/peer policy and build ordering, then modernize the core wrapper runtime contract (`NgParticlesEngineService` as default), then harden packaging and migration UX (`MIGRATION.md` / `ng update` path), and finally close with release-atomicity checks. Feature scope should stay focused on table stakes (official migration flow, beta pinning consistency, compatibility matrix, CI gates), with differentiators such as upgrade helper scripts added only after baseline reliability is green.

The top risks are not unknown technology risks; they are coordination risks in a multi-package beta migration: prerelease semver drift, sibling peer mismatch, baseline Node/TS misalignment, APF/entrypoint regressions, and partial releases. Mitigation is explicit: exact tsParticles beta pins, generated peer matrices with CI drift checks, toolchain preflight validation, tarball-based external smoke tests, and release-set atomic publish gates.

## Key Findings

### Recommended Stack

The stack research is highly prescriptive: keep the workspace on Angular 21.2.x and ng-packagr 21.x, with TypeScript aligned to the Angular-supported range (workspace currently validated on `~6.0.2`, with lockstep management required). Use pnpm workspaces for deterministic resolution, Nx as primary build/test orchestrator, and Lerna only where still needed for version/publish orchestration.

**Core technologies:**

- **Angular workspace (`@angular/core`/CLI/devkit 21.2.x):** framework + build baseline — already aligned in-repo and officially supported.
- **TypeScript (`~6.0.2`) + Angular compiler-cli range discipline:** compiler baseline — valid in current workspace, but must stay lockstep with Angular minor compatibility.
- **ng-packagr (`~21.2.2`):** APF package output — required for publishable Angular libraries.
- **pnpm workspaces (`10.33.0`):** deterministic monorepo dependency management — enables strict workspace policy enforcement.
- **Nx (`22.6.5`):** task graph/caching/affected CI — preferred executor for modern CI speed and order.
- **Lerna (`8.2.4`/optional `9.0.7`):** release/version orchestration — retain until publish flow is fully migrated.
- **tsParticles family (`@tsparticles/*`):** **exact pin `4.0.0-beta.11` across all packages** — prevents cross-beta runtime/type mismatch.
- **Playwright (`1.59.1`):** cross-browser demo smoke tests — replaces deprecated legacy e2e assumptions.

### Expected Features

Feature research strongly favors “trust-building modernization features” over net-new scope.

**Must have (table stakes):**

- Official migration-first workflow (`nx migrate` + `ng update`) with documented execution path.
- Deterministic tsParticles v4 beta dependency lane (single policy, pinned workspace versions).
- Published compatibility matrix (Angular/Ionic/Node/TypeScript constraints).
- Consumer migration guide with breaking-change mapping.
- CI gates covering packages plus Angular and Ionic demos.

**Should have (competitive):**

- Dry-run/apply upgrade commands (`upgrade:plan`, `upgrade:apply`).
- Stable↔beta channel guardrail switch for maintainers.
- Compatibility test matrix proving real Angular + Ionic integration behavior.
- “Upgrade contract” docs (scope, non-goals, release criteria).

**Defer (v2+):**

- Consumer codemod tooling for arbitrary downstream apps.
- Cross-framework wrapper coordination (React/Vue/etc.).
- Broad API redesign during this tooling milestone.

### Architecture Approach

Architecture research recommends preserving the current boundary model and hardening it: `components/*` remain publishable wrappers, `apps/*` remain integration contracts, and `public-api.ts` remains the sole export gate. Runtime should converge on a single default engine initialization path (promote `NgParticlesEngineService`; keep legacy service as compatibility bridge), with thin effect adapters and metadata sync via `scripts/prebuild.js` before package builds.

**Major components:**

1. **Root orchestration (`package.json`, `pnpm-workspace.yaml`, `nx.json`, `lerna.json`)** — dependency-aware build/release execution.
2. **Core wrapper package (`components/particles`)** — primary Angular runtime/API contract and engine init surface.
3. **Effect packages (`components/confetti`, `components/fireworks`)** — focused adapters over effect libraries.
4. **Prebuild sync scripts (`components/*/scripts/prebuild.js`)** — version/peer/README metadata alignment.
5. **Demo apps (`apps/angular-demo`, `apps/ionic-demo`)** — integration regression boundaries and proof of compatibility.

### Critical Pitfalls

1. **Prerelease semver mismatch** — enforce one workspace policy (exact beta pins) and fail CI on mixed range styles.
2. **Sibling peerDependency drift** — generate peers from one source-of-truth matrix and gate drift in CI.
3. **Angular/Node/TypeScript baseline mismatch** — freeze baseline first and add preflight compatibility checks.
4. **APF/entrypoint packaging regressions** — validate packed tarballs in clean external consumers (not only workspace links).
5. **Non-atomic release sets** — release wrappers (`angular`, `confetti`, `fireworks`) as one coordinated set.

## Implications for Roadmap

Based on combined research, suggested phase structure:

### Phase 0: Dependency Contract & Metadata Normalization

**Rationale:** Semver and peer drift are the highest-probability, highest-blast-radius failures.
**Delivers:** Exact `@tsparticles/*@4.0.0-beta.11` policy, unified peer matrix, CI drift checks, compatibility matrix draft.
**Addresses:** Table-stakes dependency lane + monorepo consistency checks.
**Avoids:** Pitfall 1 (prerelease mismatch), Pitfall 2 (peer drift).

### Phase 1: Toolchain Baseline & Orchestration Hardening

**Rationale:** Build reliability must be guaranteed before runtime refactors.
**Delivers:** Angular/Nx/TS/Node baseline lock, Nx dependency-ordered build pipeline (`dependsOn: ["^build"]`), preflight CI checks.
**Addresses:** Table-stakes migration workflow and CI gate modernization.
**Uses:** Angular 21.2.x + ng-packagr 21.x + pnpm/Nx.
**Avoids:** Pitfall 3 (baseline mismatch).

### Phase 2: Core Wrapper Modernization (Runtime Contract)

**Rationale:** Demos and effect wrappers depend on a stable, canonical core init/API surface.
**Delivers:** Promote `NgParticlesEngineService` default, export modernization in `public-api.ts`, compatibility bridge strategy for legacy init.
**Implements:** Shared engine service + stable adapter boundary pattern.
**Addresses:** Must-have migration guidance and API consistency.
**Avoids:** Architecture anti-pattern of dual default init paths.

### Phase 3: Demo Contract Validation (Angular + Ionic)

**Rationale:** This repo’s quality signal is real integration behavior, not unit-level pass rates.
**Delivers:** Updated Angular/Ionic demos using modern init path, Playwright smoke coverage, scenario matrix evidence.
**Addresses:** Must-have compatibility proof and migration-document truth source.
**Avoids:** Pitfall of shipping without validated consumer paths.

### Phase 4: Packaging, Migration Docs, and Release Atomicity

**Rationale:** Modernization is only complete when consumers can upgrade safely and installs are reproducible post-publish.
**Delivers:** APF/tarball verification, MIGRATION.md + upgrade contract docs, coordinated wrapper release checks.
**Addresses:** Table-stakes migration guide + compatibility documentation.
**Avoids:** Pitfall 4 (missing migration path), Pitfall 5 (APF regressions), Pitfall 6 (partial releases).

### Phase 5: v1.x Differentiators

**Rationale:** Add DX improvements after baseline modernization is proven stable.
**Delivers:** `upgrade:plan/apply` scripts, automated upgrade report artifacts, optional expanded demo scenarios.
**Addresses:** Differentiator feature set.
**Avoids:** Anti-feature scope creep into API redesign/cross-framework work.

### Phase Ordering Rationale

- The order follows strict dependency flow from PITFALLS + ARCHITECTURE: metadata contract → toolchain baseline → core runtime → demo validation → publish/migration hardening.
- It groups work by architecture boundaries (root orchestration, core package, demos, release pipeline), reducing cross-cutting churn.
- It front-loads irreversible failure prevention (semver/peer/toolchain issues) before user-facing enhancements.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3:** Ionic lifecycle edge cases and scenario-matrix coverage depth may need targeted `/gsd-research-phase`.
- **Phase 4:** Migration tooling depth (`ng update` schematic scope) and external tarball smoke strategy need explicit validation design.
- **Phase 5:** Upgrade automation/reporting ergonomics can benefit from focused workflow research.

Phases with standard patterns (likely skip research-phase):

- **Phase 0:** Semver policy + peer normalization are straightforward and already well documented.
- **Phase 1:** Angular/Nx baseline alignment and task ordering use established official migration patterns.
- **Phase 2:** Service-first wrapper contract pattern is already present and well-supported by architecture findings.

## Confidence Assessment

| Area         | Confidence | Notes                                                                                           |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Official Angular/Ionic/Playwright docs + npm metadata + in-repo evidence are consistent.        |
| Features     | HIGH       | Feature priorities map directly to milestone goals and validated modernization patterns.        |
| Architecture | HIGH       | Recommendations are grounded in existing workspace structure and concrete component boundaries. |
| Pitfalls     | HIGH       | Risks are specific, source-backed, and mapped to prevention phases with verifiable checks.      |

**Overall confidence:** HIGH

### Gaps to Address

- **TypeScript range policy clarity:** STACK notes TS 6.0.2 works now, but Angular docs/baselines can differ by minor; enforce one repo policy and CI check.
- **`ng update` migration depth:** decide minimum viable schematic coverage vs documentation-only path for first release.
- **Compatibility matrix breadth:** define exact supported lower Angular major to test in CI beyond build baseline.
- **Release tooling transition:** clarify whether Lerna stays temporary or is fully replaced in a later milestone.

## Sources

### Primary (HIGH confidence)

- STACK research: Angular versions/APF/library guidance, Ionic Angular overview, Playwright docs, npm registry metadata snapshots
  - https://angular.dev/reference/versions
  - https://angular.dev/tools/libraries/angular-package-format
  - https://angular.dev/tools/libraries/creating-libraries
  - https://angular.dev/tools/cli/build-system-migration
  - https://ionicframework.com/docs/angular/overview
  - https://playwright.dev/docs/intro
- FEATURES research: Angular update workflow, Nx migration docs, pnpm workspace/overrides docs
  - https://angular.dev/cli/update
  - https://angular.dev/update-guide
  - https://nx.dev/docs/features/automate-updating-dependencies
  - https://pnpm.io/workspaces
  - https://pnpm.io/settings#overrides
- ARCHITECTURE research: Angular library/APF docs + Nx run-tasks docs + repository structure evidence
  - https://angular.dev/tools/libraries/creating-libraries
  - https://angular.dev/tools/libraries/angular-package-format
  - https://nx.dev/docs/features/run-tasks
- PITFALLS research: Angular compatibility/migrations/APF docs + semver prerelease behavior + repo manifests
  - https://angular.dev/reference/versions
  - https://angular.dev/reference/migrations
  - https://angular.dev/update-guide
  - https://github.com/npm/node-semver#prerelease-tags

### Secondary (MEDIUM confidence)

- Lerna version/publish behavior context: https://lerna.js.org/docs/features/version-and-publish

### Tertiary (LOW confidence)

- None material to core recommendations.

---

_Research completed: 2026-04-10_
_Ready for roadmap: yes_
