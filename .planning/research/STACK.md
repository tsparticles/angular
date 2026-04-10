# Stack Research

**Domain:** tsParticles Angular workspace modernization + v4 beta adoption  
**Researched:** 2026-04-10  
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology                                                                           | Version                                         | Purpose                                      | Why Recommended                                                                                       |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Angular workspace (`@angular/core`, `@angular/cli`, `@angular-devkit/build-angular`) | `21.2.8 / 21.2.7`                               | Primary framework + app/library build chain  | Already aligned in repo and current stable; keeps demos modern while libraries still publish via APF. |
| TypeScript                                                                           | `~6.0.2`                                        | Compiler for workspace code                  | Current Angular 21.2 supports `>=5.9 <6.1`; TS 6.0 is valid and already used here.                    |
| ng-packagr                                                                           | `~21.2.2`                                       | Angular library packaging (APF)              | Official packaging path for published Angular libraries; required for stable npm distribution.        |
| pnpm workspaces                                                                      | `10.33.0`                                       | Deterministic monorepo dependency management | Existing workspace standard; keeps dependency graph consistent across apps/components.                |
| Nx + Lerna (hybrid)                                                                  | `nx 22.6.5`, `lerna 8.2.4` (or move to `9.0.7`) | Build orchestration + version/publish flow   | Keep Nx for execution/caching; keep Lerna only for versioning/publish until release flow is migrated. |

### Supporting Libraries (NEW capability focused)

| Library                                                                                                     | Version                                             | Purpose                                            | When to Use                                                                                                         |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `@tsparticles/*` family (`engine`, `slim`, `basic`, `confetti`, `fireworks`, plugins/updaters/interactions) | **`4.0.0-beta.11` pinned exactly**                  | v4 beta feature set and API surface                | Use exact same beta version for every `@tsparticles/*` package in workspace to avoid cross-beta incompatibility.    |
| `@tsparticles/angular`                                                                                      | `workspace:^` (publishing target currently `3.0.0`) | Angular wrapper under modernization                | Keep workspace link in demos; publish output with widened Angular peers and strict tsParticles beta peer pins.      |
| `rxjs`                                                                                                      | `~7.8.2`                                            | Angular runtime compatibility                      | Keep as Angular-compatible baseline in demos and peer deps.                                                         |
| `zone.js`                                                                                                   | `~0.16.1`                                           | Angular runtime zone support                       | Current Angular-compatible runtime line; required for standard Angular apps and Ionic Angular demos.                |
| `@ionic/angular` + `@capacitor/*` (demo scope only)                                                         | `8.8.3`, `8.x`                                      | Broad compatibility validation for Ionic consumers | Keep only inside `apps/ionic-demo` to validate integration; do not leak Ionic deps into published wrapper packages. |

### Development Tools

| Tool                                 | Purpose                                   | Notes                                                                                              |
| ------------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Angular CLI migrations (`ng update`) | Framework/tooling modernization           | Use for Angular/workspace updates; aligns config with official migration rules.                    |
| Nx (`nx run-many`, affected)         | CI speed + monorepo task graph            | Preferred executor for build/test/lint in CI.                                                      |
| Playwright (`@playwright/test`)      | Cross-browser integration smoke for demos | Add for modernization milestone to replace legacy E2E assumptions and cover Angular + Ionic demos. |

## Installation

```bash
# NEW: add modern E2E stack
pnpm add -D @playwright/test@1.59.1

# Keep tsParticles beta line unified (example)
pnpm add @tsparticles/engine@4.0.0-beta.11 @tsparticles/slim@4.0.0-beta.11

# Optional (if upgrading release tooling now)
pnpm add -D lerna@9.0.7 nx@22.6.5
```

## Alternatives Considered

| Recommended                                                | Alternative                                     | When to Use Alternative                                                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Keep `@angular-devkit/build-angular` for current workspace | Immediate switch to `@angular/build` everywhere | Use only after validating all existing app configs/migrations; not required for library packaging modernization.           |
| Exact pin `4.0.0-beta.11` across all `@tsparticles/*`      | Caret ranges on beta packages                   | Only if you want automatic beta drift; not recommended for reproducible CI in a wrapper repo.                              |
| Playwright for E2E/smoke                                   | Protractor/Cypress                              | Protractor is deprecated; Cypress is fine if team-standard, but Playwright is better cross-browser fit for this milestone. |

## What NOT to Use

| Avoid                                                              | Why                                                               | Use Instead                                                              |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Mixing tsParticles majors (`3.x` + `4.0.0-beta`) in same workspace | High risk of API/type mismatch and inconsistent demo behavior     | Pin all `@tsparticles/*` to `4.0.0-beta.11` during beta adoption.        |
| New runtime deps in published wrappers (Ionic/Capacitor/etc.)      | Inflates consumer install surface and breaks framework neutrality | Keep wrappers Angular+tsParticles only; confine Ionic stack to demo app. |
| Protractor-based E2E                                               | Officially deprecated/EOL                                         | Playwright smoke coverage for both demos.                                |
| Moving Angular peer deps to hard app-style dependencies            | Can duplicate Angular runtimes in consumer apps                   | Keep `@angular/*` as peerDependencies in publishable packages.           |

## Stack Patterns by Variant

**If validating broad Angular consumer compatibility:**

- Publish wrappers with peer range covering maintained majors (recommended: `^17 || ^18 || ^19 || ^20 || ^21`).
- Build/test workspace on Angular 21, but validate install on at least one lower supported major in CI.

**If validating Ionic compatibility:**

- Keep Ionic/Capacitor only in `apps/ionic-demo` and run smoke tests there.
- Do not add Ionic dependencies to component package peers unless wrappers directly import Ionic APIs.

## Version Compatibility

| Package A                      | Compatible With                           | Notes                                                                       |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------- | -------- | --- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `@angular/core@21.2.8`         | Node `^20.19.0                            |                                                                             | ^22.12.0 |     | ^24`; TypeScript `>=5.9 <6.0`(docs baseline), while`@angular/compiler-cli@21.2.8`currently peers`>=5.9 <6.1` | Workspace uses TS 6.0.2 successfully; keep Angular minor + TS range aligned in lockstep. |
| `ng-packagr@21.2.2`            | Angular compiler-cli `21.x`               | Match ng-packagr major with Angular major.                                  |
| `@ionic/angular@8.8.3`         | Angular `>=16`                            | Compatible with Angular 21 demo validation.                                 |
| `@tsparticles/*@4.0.0-beta.11` | Same beta across all tsParticles packages | Treat beta train as lockstep set; avoid mixing beta and latest stable tags. |

## Integration Points (for roadmap implementation)

1. **Workspace package policy:** enforce exact `4.0.0-beta.11` for every `@tsparticles/*` entry.
2. **Published package peers:** modernize Angular peers (drop `>=2.0.0` legacy ranges), keep Angular as peers not dependencies.
3. **Demo validation:** Angular demo + Ionic demo both run on Angular 21 with tsParticles beta lockstep.
4. **CI modernization:** add Playwright smoke suite for both demos; keep Nx as primary task runner.

## Sources

- Angular version compatibility matrix: https://angular.dev/reference/versions (HIGH)
- Angular package format + partial compilation: https://angular.dev/tools/libraries/angular-package-format (HIGH)
- Angular library guidance (peers, publishing): https://angular.dev/tools/libraries/creating-libraries (HIGH)
- Angular build system migration guidance: https://angular.dev/tools/cli/build-system-migration (HIGH)
- Ionic Angular support statement (`>=16`): https://ionicframework.com/docs/angular/overview (HIGH)
- Playwright docs + system requirements: https://playwright.dev/docs/intro (HIGH)
- npm registry metadata (verified via `npm view`, 2026-04-10):
  - `@angular/core` `21.2.8` (HIGH)
  - `@angular/cli` `21.2.7` (HIGH)
  - `ng-packagr` `21.2.2` (HIGH)
  - `typescript` `6.0.2` (HIGH)
  - `nx` `22.6.5` (HIGH)
  - `lerna` `9.0.7` (HIGH)
  - `@ionic/angular` `8.8.3` (HIGH)
  - `@capacitor/core` `8.3.0` (HIGH)
  - `@tsparticles/engine` dist-tags incl. `beta: 4.0.0-beta.11` (HIGH)

---

_Stack research for: tsParticles Angular v4 beta modernization milestone_  
_Researched: 2026-04-10_
