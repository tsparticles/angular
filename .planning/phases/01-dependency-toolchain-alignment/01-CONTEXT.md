# Phase 1: Dependency & Toolchain Alignment - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish a single, enforceable dependency and toolchain policy for the Angular/Ionic workspace so maintainers can reliably build, test, and upgrade on a modern Angular baseline while preserving documented compatibility for prior supported Angular versions.

</domain>

<decisions>
## Implementation Decisions

### tsParticles dependency policy

- **D-01:** Standardize all `@tsparticles/*` runtime dependencies used by workspace packages on `4.0.0-beta.11` for this milestone; mixed majors/prerelease lines are not allowed.
- **D-02:** Normalize tsParticles semver usage to avoid ambiguous drift (no mixed exact/caret prerelease specifiers for the same package family).
- **D-03:** Keep publishable Angular wrapper package versions aligned as one release train (`@tsparticles/angular`, `angular-confetti`, `angular-fireworks`) so cross-package compatibility stays explicit.

### Angular and peer compatibility policy

- **D-04:** Use Angular `21.2.x` as the primary build/test baseline for Phase 1.
- **D-05:** Replace overly broad or inconsistent peer ranges with one documented compatibility policy shared across wrappers, then validate it against the agreed support matrix.

### CI policy enforcement

- **D-06:** Add a dedicated dependency-policy gate in CI that fails on mixed tsParticles majors, wrapper version drift, and peer-range misalignment across publishable packages.
- **D-07:** Keep enforcement repository-local (workspace script/check) and run it before existing `build:ci` so policy violations fail fast.

### Upgrade workflow contract

- **D-08:** Introduce a repeatable maintainer upgrade flow doc for dependency bumps (update manifests, run policy check, run build/test, verify compatibility matrix, then release prep).
- **D-09:** Treat compatibility validation evidence as part of the workflow output (not implicit), so future upgrades are lower risk and auditable.

### the agent's Discretion

- Exact implementation of the dependency-policy checker (custom Node script vs existing monorepo tooling), as long as it is deterministic in CI.
- Exact compatibility matrix breadth for non-blocking checks, provided it still enforces the documented support policy.
- Where upgrade documentation lives (`docs/` vs `.planning/`), provided it is easy for maintainers to discover.

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements

- `.planning/ROADMAP.md` — Phase 1 goal, dependency/toolchain success criteria, and delivery boundary.
- `.planning/REQUIREMENTS.md` — DEPS-01..03 and TOOL-01..03 requirements that Phase 1 must satisfy.
- `.planning/PROJECT.md` — milestone intent, constraints, and modernization goals affecting dependency/toolchain decisions.

### Workspace policy surfaces

- `package.json` — root scripts and monorepo orchestration entry points (`build`, `build:ci`, Lerna/Nx integration).
- `pnpm-workspace.yaml` — workspace package boundaries and build allowances relevant to policy enforcement.
- `lerna.json` — release/version orchestration baseline for multi-package alignment.
- `nx.json` — target defaults and cache behavior that constrain CI/toolchain changes.
- `.github/workflows/nodejs.yml` — current CI gate shape where dependency-policy enforcement must be integrated.

### Package manifests to align

- `apps/angular-demo/package.json` — consumer app dependency surface using workspace wrappers + tsParticles packages.
- `apps/ionic-demo/package.json` — Ionic consumer app dependency surface and dev-tooling policy.
- `components/particles/package.json` — wrapper package toolchain/runtime dependency baseline.
- `components/confetti/package.json` — wrapper package dependency baseline.
- `components/fireworks/package.json` — wrapper package dependency baseline.
- `components/particles/projects/ng-particles/package.json` — publishable peer dependency policy for `@tsparticles/angular`.
- `components/confetti/projects/ng-confetti/package.json` — publishable peer dependency policy for `angular-confetti`.
- `components/fireworks/projects/ng-fireworks/package.json` — publishable peer dependency policy for `angular-fireworks`.

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- Root monorepo scripts in `package.json` already centralize build orchestration and can host policy-check commands.
- Existing CI workflow in `.github/workflows/nodejs.yml` already runs install + formatting + `build:ci`, providing a direct insertion point for fail-fast policy checks.
- Package-level manifests across `apps/*` and `components/*` already contain the dependency/peer data needed for deterministic consistency checks.

### Established Patterns

- Workspace uses pnpm + Lerna + Nx jointly; Phase 1 should preserve that orchestration pattern rather than introducing parallel release/build systems.
- Toolchain versions are already mostly converged around Angular `21.2.x` and TypeScript `~6.0.2`; decisions should tighten consistency rather than redesign stack choices.
- Publishable wrappers expose peer policies via nested `projects/*/package.json`; alignment must happen there, not only in top-level package manifests.

### Integration Points

- CI policy gate integrates into `.github/workflows/nodejs.yml` before `pnpm run build:ci`.
- Dependency alignment changes touch both consumer apps (`apps/*/package.json`) and wrapper packages (`components/*/package.json`).
- Peer/version policy enforcement touches publishable manifests under `components/*/projects/*/package.json`.

</code_context>

<specifics>
## Specific Ideas

- [auto] Selected all gray areas for discussion in auto mode: tsParticles versioning policy, Angular peer compatibility, CI enforcement depth, upgrade workflow shape.
- [auto] Preferred decisions prioritize deterministic CI enforcement and one workspace-wide policy over ad-hoc package-level exceptions.
- Keep implementation practical for maintainers: enforceable rules first, automation/documentation second, no unnecessary tooling churn.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 01-dependency-toolchain-alignment_
_Context gathered: 2026-04-10_
