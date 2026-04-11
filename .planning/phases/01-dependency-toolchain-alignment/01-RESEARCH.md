---
phase: 01
slug: dependency-toolchain-alignment
status: complete
date: 2026-04-10
---

# Phase 01 Research — Dependency & Toolchain Alignment

## Objective

Identify the lowest-risk implementation path for enforcing a single tsParticles `4.0.0-beta.11` policy, aligned wrapper versions/peer ranges, and fail-fast CI enforcement on the Angular `21.2.x` baseline.

## Inputs Reviewed

- `.planning/phases/01-dependency-toolchain-alignment/01-CONTEXT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `package.json`
- `.github/workflows/nodejs.yml`
- `apps/angular-demo/package.json`
- `apps/ionic-demo/package.json`
- `components/particles/package.json`
- `components/confetti/package.json`
- `components/fireworks/package.json`
- `components/particles/projects/ng-particles/package.json`
- `components/confetti/projects/ng-confetti/package.json`
- `components/fireworks/projects/ng-fireworks/package.json`

## Findings

### 1) Current drift and policy gaps

- Most tsParticles packages are pinned to `4.0.0-beta.11`, but some entries use caret prerelease ranges (e.g., `^4.0.0-beta.11`) in `apps/angular-demo/package.json` and peer deps in `ng-confetti`.
- Wrapper package versions are currently aligned (`3.0.0`) but there is no dedicated CI gate that guarantees this remains true.
- Angular peer ranges in publishable packages are inconsistent and too broad vs the selected baseline/support policy (D-04, D-05).

### 2) CI/toolchain inconsistencies affecting repeatability

- GitHub Actions sets pnpm version `8`/`7` while root `packageManager` requires `pnpm@10.33.0`.
- CI currently runs formatting + `build:ci`, but lacks fail-fast dependency policy checks before build.

### 3) Best implementation shape

- A repository-local Node policy checker script is the most deterministic and least disruptive way to enforce D-06/D-07.
- Script should parse all required manifests, validate:
  1. tsParticles versions are all exactly `4.0.0-beta.11` (D-01, D-02)
  2. wrapper versions are identical across publishable wrappers (D-03)
  3. peer ranges follow one compatibility policy map for Angular/RxJS/tsParticles peers (D-05)
- Wire checker as root script, executed before `build:ci` and explicitly in CI workflow.

## Recommended Standards

## Standard Stack

- Node.js 20 (CI/runtime baseline)
- pnpm 10.33.0 (from `packageManager`)
- Existing workspace orchestrators only: pnpm + Lerna + Nx
- Existing test/build path: `pnpm run build:ci`

## Architecture Patterns

- Single source of truth for policy values in checker module constants.
- Deterministic manifest scan over explicit file list from canonical refs.
- Fail fast with non-zero exit and actionable error lines prefixed by file path.
- Keep enforcement repository-local and scriptable (no hosted/external policy service).

## Don’t Hand-Roll

- Do not introduce a new monorepo orchestration system.
- Do not spread policy logic across multiple ad-hoc shell snippets in workflow files.
- Do not rely only on build failures to catch dependency drift.

## Common Pitfalls

- Allowing caret prerelease ranges (`^4.0.0-beta.11`) silently reintroduces drift.
- Updating top-level wrapper package manifests but forgetting publishable `projects/*/package.json` peers.
- Passing local checks with pnpm 10 while CI still installs pnpm 7/8.

## Validation Architecture

Validation should happen at three levels:

1. **Policy checker unit-of-truth validation**
   - Run `node scripts/check-dependency-policy.mjs`
   - Must fail when any dependency/peer/version policy rule is violated.

2. **Fail-fast CI gate validation**
   - CI must execute policy checker before `pnpm run build:ci`.
   - Any policy violation blocks the pipeline before expensive builds.

3. **Upgrade workflow validation evidence**
   - Maintainer documentation includes a checklist requiring:
     - policy check output
     - build/test output
     - compatibility matrix evidence capture

### Acceptance Signals

- `pnpm run deps:policy:check` exits 0 on compliant manifests.
- CI workflow contains an explicit policy check step before build step.
- Upgrade docs contain concrete ordered steps and evidence artifacts.

## Requirement Mapping

- **DEPS-01**: exact `4.0.0-beta.11` policy in all scoped dependencies/peers.
- **DEPS-02**: policy checker rejects mixed major/prerelease specifiers.
- **DEPS-03**: checker + CI gate enforce wrapper/peer alignment.
- **TOOL-01**: build/test executed on Angular `21.2.x` baseline with aligned CI tool versions.
- **TOOL-02**: one documented peer compatibility policy validated by checker.
- **TOOL-03**: documented repeatable upgrade workflow with explicit evidence output.

## Output

Research complete. Phase can proceed to planning with deterministic repository-local enforcement and documentation-first upgrade contracts.
