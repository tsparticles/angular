---
phase: 01-dependency-toolchain-alignment
plan: 02
subsystem: infra
tags: [ci, policy-gate, node-script, pnpm]
requires:
  - phase: 01-dependency-toolchain-alignment
    provides: Manifest-level dependency and peer policy baseline
provides:
  - Repository-local dependency policy checker
  - Root script entrypoint for local and CI enforcement
  - Fail-fast CI workflow wiring before build steps
affects: [build, release, maintainer-workflow]
tech-stack:
  added: []
  patterns: [explicit manifest allowlist, deterministic policy validation]
key-files:
  created:
    - scripts/check-dependency-policy.mjs
  modified:
    - package.json
    - .github/workflows/nodejs.yml
key-decisions:
  - "Implemented policy checks in a single Node script with explicit path allowlists and constant policy values."
  - "Set CI pnpm setup to 10.33.0 and inserted policy check before build in both main and pr jobs."
patterns-established:
  - "Dependency policy is validated by code, not inferred from build failures."
requirements-completed: [DEPS-02, DEPS-03, TOOL-01]
duration: 20 min
completed: 2026-04-10
---

# Phase 01 Plan 02: CI policy gate summary

**Dependency policy drift is now blocked by a shared local/CI checker that runs before expensive builds.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-10T18:56:23Z
- **Completed:** 2026-04-10T18:56:23Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added `scripts/check-dependency-policy.mjs` to enforce tsParticles exact versions, wrapper version alignment, and peer policy ranges.
- Added root script `deps:policy:check` in `package.json`.
- Updated `.github/workflows/nodejs.yml` to use pnpm `10.33.0` and run `pnpm run deps:policy:check` before `pnpm run build:ci`.

## Task Commits

Not committed in this execution run.

## Files Created/Modified

- `scripts/check-dependency-policy.mjs` - deterministic dependency policy checker.
- `package.json` - adds reusable `deps:policy:check` script.
- `.github/workflows/nodejs.yml` - adds fail-fast policy gate and aligns pnpm versions.

## Decisions Made

- Policy checker validates an explicit manifest list to keep behavior deterministic and auditable.

## Deviations from Plan

None - plan executed with intended implementation shape.

## Issues Encountered

- `pnpm run build:ci` currently fails in this workspace after dependency refresh due pre-existing Angular/TypeScript compatibility and component/module contract issues unrelated to the policy checker.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Policy gate is ready and running locally; CI pipeline now fails earlier on policy drift.
- Build stability remediation remains needed to fully satisfy TOOL-01 runtime verification.

---

_Phase: 01-dependency-toolchain-alignment_
_Completed: 2026-04-10_
