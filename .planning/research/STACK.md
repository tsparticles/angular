# Stack Research

**Domain:** Angular particle-effects component library + demo workspace  
**Researched:** 2026-04-10  
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology                                                             | Version                    | Purpose                                       | Why Recommended                                                                                                        | Confidence |
| ---------------------------------------------------------------------- | -------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | --- | --------------------------------------------------------- | ---- |
| Angular framework (`@angular/core`, `@angular/common`, `@angular/cli`) | 21.2.x                     | Primary framework + CLI for library and demos | Angular 21 is the current supported line; official library tooling/docs are aligned with APF + partial-Ivy publishing. | HIGH       |
| TypeScript                                                             | 5.9.x (pin `<6.0`)         | Type system and library build input           | Angular 21 compatibility requires TS `>=5.9 <6.0`; pinning avoids breakage from TS 6 major changes.                    | HIGH       |
| Node.js                                                                | 22.12+ LTS (or 20.19+/24+) | Runtime for toolchain/CI                      | Angular 21 officially supports Node `^20.19                                                                            |            | ^22.12 |     | ^24`; Node 22 LTS is the safest default for 2025-2026 CI. | HIGH |
| pnpm workspaces                                                        | 10.33.x                    | Package manager + monorepo dependency graph   | Fast installs, strict workspace linking (`workspace:` protocol), and already standard in this repo layout.             | HIGH       |
| Nx                                                                     | 22.6.x                     | Task orchestration, caching, affected runs    | Best fit for multi-app/multi-lib Angular workspaces at scale; reduces CI cost and keeps boundaries enforceable.        | HIGH       |
| ng-packagr (via Angular library builder)                               | 21.2.x                     | Build/publish Angular libraries in APF        | Official Angular library packaging path; emits APF-compatible artifacts and supports partial-Ivy publishing.           | HIGH       |

### Supporting Libraries

| Library                | Version | Purpose                                    | When to Use                                                                     | Confidence |
| ---------------------- | ------- | ------------------------------------------ | ------------------------------------------------------------------------------- | ---------- | -------- | ---- |
| `@tsparticles/engine`  | 3.9.1   | Core rendering engine                      | Always; wrapper should expose engine init path and plugin loading.              | HIGH       |
| `@tsparticles/angular` | 3.0.0   | Angular wrapper package                    | For consumer integration and API compatibility tests in demos.                  | HIGH       |
| `@tsparticles/slim`    | 3.9.1   | Smaller preset bundle                      | Default for demo apps and docs examples to keep payload lower than full bundle. | HIGH       |
| `rxjs`                 | 7.8.x   | Angular reactive primitives                | Required by Angular peer compatibility; use stable 7.x line.                    | HIGH       |
| `zone.js`              | 0.16.x  | Angular change detection runtime           | Keep within Angular-supported range (`~0.15                                     |            | ~0.16`). | HIGH |
| `@ionic/angular`       | 8.8.x   | Ionic Angular demo compatibility           | Include in dedicated demo app only, to validate Ionic integration requirement.  | HIGH       |
| `@playwright/test`     | 1.59.x  | E2E + visual/regression coverage for demos | Use for smoke + interaction tests across Chromium/WebKit/Firefox.               | HIGH       |

### Development Tools

| Tool               | Purpose                                   | Notes                                                                                                                         |
| ------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Angular CLI (`ng`) | Generate/build/test Angular libs/apps     | Keep workspace generation/migrations on official CLI path.                                                                    |
| Nx CLI (`nx`)      | Run affected/build/test/lint with caching | Use as primary task runner in CI (`nx run-many`, `nx affected`).                                                              |
| Lerna              | Multi-package version/publish workflows   | Keep only for publish/version orchestration if already in release flow; do not use as primary task runner when Nx is present. |
| Prettier           | Formatting consistency                    | Keep README/docs/code style deterministic in CI.                                                                              |

## Installation

```bash
# Core workspace stack
pnpm add -D @angular/cli@21.2.7 nx@22.6.4 ng-packagr@21.2.2 typescript@5.9.3

# Runtime + Angular compatibility
pnpm add rxjs@7.8.2 zone.js@0.16.1 tslib@2.8.1

# Particle stack
pnpm add @tsparticles/engine@3.9.1 @tsparticles/angular@3.0.0 @tsparticles/slim@3.9.1

# Demo and testing
pnpm add -D @playwright/test@1.59.1
pnpm add @ionic/angular@8.8.3
```

## Alternatives Considered

| Recommended               | Alternative                          | When to Use Alternative                                                                                                                                      |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nx for task orchestration | Lerna-only task running              | Only in very small repos with trivial CI; for this workspace Nx is superior for caching/affected execution.                                                  |
| ng-packagr + APF          | Custom Rollup/Vite library packaging | Only if you are not shipping an Angular library for npm consumers; APF is the ecosystem standard for Angular packages.                                       |
| Playwright for E2E demos  | Cypress                              | Use Cypress only if team expertise/tooling is already deeply Cypress-centric; Playwright is currently stronger for cross-browser matrix and modern CI speed. |

## What NOT to Use

| Avoid                                                             | Why                                                                                 | Use Instead                                                        |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Publishing Angular libraries in **full-Ivy** format               | Angular docs explicitly warn it is not stable across versions for npm distribution. | Publish **partial-Ivy** APF packages (`compilationMode: partial`). |
| Treating `@angular/*` as regular `dependencies` in published libs | Risks duplicate Angular copies and runtime breakage in consumers.                   | Put `@angular/*` in `peerDependencies` for published packages.     |
| TypeScript 6.x with Angular 21                                    | Outside Angular 21 compatibility range.                                             | Pin TypeScript 5.9.x until Angular supports TS 6.                  |
| Mixing npm/yarn/pnpm lockfiles in one monorepo                    | Non-deterministic installs and CI drift.                                            | Standardize on pnpm + single `pnpm-lock.yaml`.                     |
| Protractor-based E2E strategy                                     | Legacy/deprecated ecosystem, poor fit for current Angular testing stacks.           | Playwright for E2E and browser-level smoke/regression.             |

## Stack Patterns by Variant

**If shipping only Angular library + web demos:**

- Use Angular CLI + ng-packagr + Nx + Playwright.
- Because this is the shortest path to APF-compliant publishing and fast CI.

**If also validating Ionic Angular compatibility:**

- Add a dedicated Ionic Angular demo app (`@ionic/angular` 8.x) in `apps/`.
- Because it catches integration regressions early without polluting the core wrapper package.

## Version Compatibility

| Package A                    | Compatible With                                         | Notes                                         |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------- | ------ | --- | ----------------------------------- | --- | ------- | -------------------------------------- |
| `@angular/core@21.2.x`       | Node `^20.19                                            |                                               | ^22.12 |     | ^24`, TS `>=5.9 <6.0`, RxJS `^6.5.3 |     | ^7.4.0` | Official Angular compatibility matrix. |
| `ng-packagr@21.2.2`          | TypeScript `>=5.9 <6.0`, Angular compiler-cli `^21.0.0` | Align ng-packagr major with Angular major.    |
| `@ionic/angular@8.8.x`       | Angular `>=16`                                          | Works with Angular 21 demo app scenarios.     |
| `@tsparticles/angular@3.0.0` | `@tsparticles/engine` `^3.0.2`                          | Keep engine and presets on the same 3.x line. |

## Sources

- Angular version compatibility: https://angular.dev/reference/versions (HIGH)
- Angular library creation/publishing guidance: https://angular.dev/tools/libraries/creating-libraries (HIGH)
- Angular Package Format (APF, partial compilation, exports): https://angular.dev/tools/libraries/angular-package-format (HIGH)
- Angular CLI local setup/workspace model: https://angular.dev/tools/cli/setup-local (HIGH)
- npm registry latest metadata:
  - https://registry.npmjs.org/@angular/core/latest (HIGH)
  - https://registry.npmjs.org/@angular/cli/latest (HIGH)
  - https://registry.npmjs.org/ng-packagr/latest (HIGH)
  - https://registry.npmjs.org/typescript/latest (HIGH)
  - https://registry.npmjs.org/rxjs/latest (HIGH)
  - https://registry.npmjs.org/zone.js/latest (HIGH)
  - https://registry.npmjs.org/nx/latest (HIGH)
  - https://registry.npmjs.org/lerna/latest (HIGH)
  - https://registry.npmjs.org/pnpm/latest (HIGH)
  - https://registry.npmjs.org/@playwright/test/latest (HIGH)
  - https://registry.npmjs.org/@tsparticles/angular/latest (HIGH)
  - https://registry.npmjs.org/@tsparticles/engine/latest (HIGH)
  - https://registry.npmjs.org/@tsparticles/slim/latest (HIGH)
  - https://registry.npmjs.org/@ionic/angular/latest (HIGH)
- pnpm workspace protocol/docs: https://pnpm.io/workspaces (HIGH)
- Nx overview (task orchestration/caching): https://nx.dev/getting-started/intro (MEDIUM-HIGH)
- Lerna positioning (Nx-powered modern Lerna): https://lerna.js.org/ (MEDIUM)
- Playwright docs/system requirements: https://playwright.dev/docs/intro (HIGH)
- Ionic Angular overview and support: https://ionicframework.com/docs/angular/overview (HIGH)

---

_Stack research for: Angular particle-effects component library and demos_  
_Researched: 2026-04-10_
