# Dependency Upgrade Workflow

This runbook defines the required process for dependency upgrades in the Angular workspace.

## Scope

- Applies to workspace manifests under `apps/*`, `components/*`, and publishable wrappers under `components/*/projects/*`.
- Enforces tsParticles policy `4.0.0-beta.11` and shared wrapper peer compatibility policy.

## Preconditions

- Use Node.js 20.
- Use pnpm 10.33.0 (matching root `packageManager`).
- Start from a clean working tree for upgrade changes.

## Ordered Upgrade Checklist

1. Update manifests to policy values.
   - Set all `tsparticles` and `@tsparticles/*` dependency/peer entries to exact `4.0.0-beta.11`.
   - Keep workspace links for local wrappers as `workspace:^` where applicable.
   - Ensure publishable wrapper peer policy matches:
     - `@angular/common`: `^20 || ^21`
     - `@angular/core`: `^20 || ^21`
     - `rxjs`: `^7.8.0`
2. Install dependencies.
   - Run: `pnpm install`
3. Run dependency policy gate.
   - Run: `pnpm run deps:policy:check`
4. Run workspace CI-equivalent build.
   - Run: `pnpm run build:ci`
5. Validate compatibility matrix.
   - Execute smoke/build validation for all supported Angular majors in the policy range.
   - Capture which wrapper packages were validated for each supported major.
6. Capture evidence artifacts.
   - Save command outputs for:
     - `pnpm run deps:policy:check`
     - `pnpm run build:ci`
   - Record compatibility matrix evidence table.
   - Record related PR/issue links.
7. Release-prep confirmation.
   - Confirm wrapper publishable versions are aligned.
   - Confirm CI workflow still runs policy gate before build.
   - Confirm no unresolved policy or build failures remain.

## Evidence Contract

For every upgrade PR, include the following evidence:

- Policy check output showing pass/fail status.
- Build output from `pnpm run build:ci`.
- Compatibility matrix table with tested Angular majors and result.
- Links to PR, issue, and any follow-up tasks.

## Failure Handling

- If `pnpm run deps:policy:check` fails, stop release preparation and fix policy drift before continuing.
- If `pnpm run build:ci` fails, stop release preparation and resolve build/test issues before continuing.
- If compatibility matrix validation is incomplete or failing, do not mark the upgrade as release-ready.
- Releases are blocked until all checklist steps and evidence requirements are satisfied.
