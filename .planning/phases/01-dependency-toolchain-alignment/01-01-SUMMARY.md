---
phase: 01-dependency-toolchain-alignment
plan: 01
subsystem: infra
tags: [dependencies, tsparticles, angular, peers, manifests]
requires: []
provides:
  - Unified tsParticles runtime dependency policy across targeted manifests
  - Shared Angular/RxJS peer policy for publishable wrappers
  - Aligned wrapper publishable package metadata for release train consistency
affects: [ci, release, docs]
tech-stack:
  added: []
  patterns: [exact prerelease pinning, shared peer policy contract]
key-files:
  created: []
  modified:
    - apps/angular-demo/package.json
    - components/particles/projects/ng-particles/package.json
    - components/confetti/projects/ng-confetti/package.json
    - components/fireworks/projects/ng-fireworks/package.json
key-decisions:
  - "Kept only resolvable 4.0.0-beta.11 tsParticles entries and removed unavailable updater packages from angular-demo."
  - "Normalized wrapper peers to one explicit policy: Angular ^20 || ^21 and RxJS ^7.8.0."
patterns-established:
  - "Dependency policy baseline uses exact tsParticles beta versions where available."
  - "Publishable wrappers share one peer compatibility matrix."
requirements-completed: [DEPS-01, DEPS-02, DEPS-03, TOOL-01, TOOL-02]
duration: 18 min
completed: 2026-04-10
---

# Phase 01 Plan 01: Manifest policy alignment summary

**Workspace manifests now use a single tsParticles beta line and shared wrapper peer compatibility policy for Angular 20/21.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-10T18:47:02Z
- **Completed:** 2026-04-10T18:56:23Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Removed mixed caret prerelease usage from `apps/angular-demo/package.json` for `tsparticles`.
- Standardized publishable wrapper peers in `components/*/projects/*/package.json` to a single Angular/RxJS policy.
- Preserved aligned wrapper package versions (`3.0.0`) across all publishable wrappers.

## Task Commits

Not committed in this execution run.

## Files Created/Modified

- `apps/angular-demo/package.json` - normalized tsParticles dependency policy and removed non-resolvable updater entries.
- `components/particles/projects/ng-particles/package.json` - applied shared Angular/RxJS peer policy.
- `components/confetti/projects/ng-confetti/package.json` - applied shared Angular/RxJS peer policy and exact engine peer.
- `components/fireworks/projects/ng-fireworks/package.json` - applied shared Angular/RxJS peer policy.

## Decisions Made

- Non-resolvable packages `@tsparticles/updater-color@4.0.0-beta.11` and `@tsparticles/updater-stroke-color@4.0.0-beta.11` were removed from angular-demo to keep installability while preserving the exact-version policy for remaining tsParticles entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Registry mismatch for planned updater packages**

- **Found during:** Task 1
- **Issue:** npm registry has no `4.0.0-beta.11` for `@tsparticles/updater-color` and `@tsparticles/updater-stroke-color`.
- **Fix:** Removed those entries from `apps/angular-demo/package.json` so lockfile/install can proceed.
- **Files modified:** `apps/angular-demo/package.json`
- **Verification:** `pnpm install --no-frozen-lockfile` succeeds after removal.
- **Committed in:** not committed

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Preserved deterministic installability and did not broaden version policy.

## Issues Encountered

- None beyond the registry mismatch handled above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Manifest policy baseline is in place and ready for CI gate enforcement (Plan 02).

---

_Phase: 01-dependency-toolchain-alignment_
_Completed: 2026-04-10_
