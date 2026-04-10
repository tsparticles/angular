# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**

- TypeScript 6.0.x - Application, library, and demo source in `apps/angular-demo/src/**/*.ts`, `apps/ionic-demo/src/**/*.ts`, `components/*/projects/*/src/**/*.ts`; compiler version pinned in `apps/angular-demo/package.json`, `apps/ionic-demo/package.json`, `components/particles/package.json`, `components/confetti/package.json`, and `components/fireworks/package.json`.

**Secondary:**

- JavaScript (Node/CommonJS) - Build/prepack automation scripts in `components/particles/scripts/prebuild.js`, `components/confetti/scripts/prebuild.js`, `components/fireworks/scripts/prebuild.js`.
- HTML/SCSS/CSS - Angular and Ionic templates/styles in `apps/angular-demo/src/**/*.html|css`, `apps/ionic-demo/src/**/*.html|scss`.

## Runtime

**Environment:**

- Node.js 20 (CI runtime via `actions/setup-node@v4` with `node-version: '20'`) in `.github/workflows/nodejs.yml`.

**Package Manager:**

- pnpm 10.33.0 (workspace-level `packageManager`) in `package.json`.
- Lockfile: present (`pnpm-lock.yaml`, lockfileVersion `9.0`).

## Frameworks

**Core:**

- Angular 21.2.x - Primary framework for libraries and demos (`@angular/core`, `@angular/cli`, `@angular-devkit/build-angular`) declared in `apps/angular-demo/package.json`, `apps/ionic-demo/package.json`, and `components/*/package.json`.
- Ionic Angular 8.8.x - Mobile UI demo framework in `apps/ionic-demo/package.json` and configured in `apps/ionic-demo/angular.json`.
- tsParticles 4.0.0-beta.11 ecosystem - Core particle engine and plugins used across demos/libraries (`@tsparticles/*`, `tsparticles`) in `apps/angular-demo/package.json`, `apps/ionic-demo/package.json`, `components/*/package.json`.

**Testing:**

- Jasmine 6 + Karma 6 - Unit test stack configured via `apps/angular-demo/karma.conf.js`, `apps/ionic-demo/karma.conf.js`, `components/particles/projects/ng-particles/karma.conf.js` and package dependencies.
- Protractor 7 - E2E runner for Ionic demo configured in `apps/ionic-demo/e2e/protractor.conf.js` and `apps/ionic-demo/angular.json`.

**Build/Dev:**

- Angular CLI builders - App build/test/serve via `apps/angular-demo/angular.json` and `apps/ionic-demo/angular.json`.
- ng-packagr 21.2.x - Angular library packaging in `components/particles/angular.json`, `components/confetti/angular.json`, `components/fireworks/angular.json`.
- Nx 22.6.x + Lerna 8.2.x - Monorepo orchestration (`nx.json`, root scripts in `package.json`).
- TypeDoc 0.28.x + plugins - API docs generation in `typedoc.json` and root `package.json` scripts.

## Key Dependencies

**Critical:**

- `@tsparticles/engine` `4.0.0-beta.11` - Core rendering engine used by Angular wrappers in `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts` and demos (`apps/angular-demo/src/app/app.component.ts`).
- `@angular/core` `~21.2.8` - Angular DI/component runtime across all packages (`apps/*/package.json`, `components/*/package.json`).
- `@tsparticles/angular` `workspace:^` - Local workspace Angular wrapper consumed by demos in `apps/angular-demo/package.json` and `apps/ionic-demo/package.json`.

**Infrastructure:**

- `pnpm` workspaces - Multi-package management in `pnpm-workspace.yaml` and root `package.json` `workspaces`.
- `nx` - Task caching/orchestration configured in `nx.json`.
- `lerna` - Multi-package build pipeline via root scripts in `package.json`.
- `prettier` + `@tsparticles/prettier-config` - Formatting in root and component package manifests.
- `husky` + `@commitlint/*` - Commit hooks and commit message linting in `.husky/commit-msg` and `.commitlintrc.json`.

## Configuration

**Environment:**

- Environment toggles use Angular `environment.ts` replacement pattern in `apps/angular-demo/src/environments/environment.ts`, `apps/angular-demo/angular.json`, `apps/ionic-demo/src/environments/environment.ts`, `apps/ionic-demo/angular.json`.
- No `.env` files detected in repository root/workspace (`**/.env*` search returned none).
- Strict TypeScript and Angular compiler settings are enabled in `apps/angular-demo/tsconfig.json`, `components/confetti/tsconfig.json`, and `components/fireworks/tsconfig.json`.

**Build:**

- Workspace/monorepo configs: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `nx.json`.
- Angular project configs: `apps/angular-demo/angular.json`, `apps/ionic-demo/angular.json`, `components/particles/angular.json`, `components/confetti/angular.json`, `components/fireworks/angular.json`.
- Documentation config: `typedoc.json`.
- Update automation config: `renovate.json`.

## Platform Requirements

**Development:**

- Node.js + pnpm required to install/build workspace (root `package.json`, `.github/workflows/nodejs.yml`).
- Angular CLI-based toolchain required for app and library builds (`@angular/cli`, `@angular-devkit/build-angular` in package manifests).

**Production:**

- Browser deployment target for Angular app bundles (`dist/ng-particles-demo` in `apps/angular-demo/angular.json`) and Ionic web output (`www` in `apps/ionic-demo/angular.json` + `webDir` in `apps/ionic-demo/capacitor.config.ts`).
- Package publication target is npm registry for libraries (`publishConfig` in `components/*/projects/*/package.json`, build output under `components/*/dist/*`).

---

_Stack analysis: 2026-04-10_
