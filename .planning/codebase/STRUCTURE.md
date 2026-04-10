# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
[project-root]/
├── apps/                    # Demo/consumer applications
│   ├── angular-demo/        # Angular demo app consuming workspace libraries
│   └── ionic-demo/          # Ionic + Angular demo app with tab-based routing
├── components/              # Publishable Angular library packages
│   ├── particles/           # Main `@tsparticles/angular` wrapper library
│   ├── confetti/            # `angular-confetti` wrapper library
│   └── fireworks/           # `angular-fireworks` wrapper library
├── .planning/codebase/      # Generated architecture/quality/stack docs
├── package.json             # Root workspace scripts and shared tooling
├── pnpm-workspace.yaml      # Workspace package globs
├── lerna.json               # Lerna orchestration config
└── nx.json                  # Nx cache defaults/target configuration
```

## Directory Purposes

**`apps/`:**

- Purpose: Hold runnable applications that consume local libraries.
- Contains: Angular app source (`src/`), app-level `angular.json`, app `package.json`, and app test/e2e configs.
- Key files: `apps/angular-demo/src/main.ts`, `apps/ionic-demo/src/main.ts`, `apps/ionic-demo/src/app/tabs/tabs-routing.module.ts`

**`components/`:**

- Purpose: Hold independently versioned/published Angular component libraries.
- Contains: One package per feature (`particles`, `confetti`, `fireworks`) with package-local build config and `projects/*` library source.
- Key files: `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`, `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`

**`components/*/projects/*/src/`:**

- Purpose: Library source roots used by ng-packagr.
- Contains: `public-api.ts` and `lib/` implementation files.
- Key files: `components/particles/projects/ng-particles/src/public-api.ts`, `components/confetti/projects/ng-confetti/src/public-api.ts`, `components/fireworks/projects/ng-fireworks/src/public-api.ts`

**`components/*/scripts/`:**

- Purpose: Prebuild metadata synchronization.
- Contains: Node scripts that copy/update nested package metadata before builds.
- Key files: `components/particles/scripts/prebuild.js`, `components/confetti/scripts/prebuild.js`, `components/fireworks/scripts/prebuild.js`

**`components/*/dist/`:**

- Purpose: Built output for package publishing.
- Contains: Generated JS bundles, type declarations, generated package metadata.
- Key files: `components/particles/dist/ng-particles/package.json`, `components/confetti/dist/ng-confetti/package.json`, `components/fireworks/dist/ng-fireworks/package.json`

## Key File Locations

**Entry Points:**

- `apps/angular-demo/src/main.ts`: Angular demo bootstrap.
- `apps/ionic-demo/src/main.ts`: Ionic demo bootstrap.
- `components/particles/projects/ng-particles/src/public-api.ts`: Primary library export entry.
- `components/confetti/projects/ng-confetti/src/public-api.ts`: Confetti library export entry.
- `components/fireworks/projects/ng-fireworks/src/public-api.ts`: Fireworks library export entry.

**Configuration:**

- `package.json`: Root script orchestration and workspace metadata.
- `pnpm-workspace.yaml`: Workspace package boundaries (`apps/*`, `components/*`).
- `lerna.json`: Multi-package version/build orchestration.
- `nx.json`: Target defaults and cache behavior.
- `apps/angular-demo/angular.json`: Angular demo build/test targets.
- `apps/ionic-demo/angular.json`: Ionic demo build/test/lint/e2e targets.
- `components/particles/angular.json`: Library build/test targets for ng-packagr.

**Core Logic:**

- `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`: Angular-to-engine adapter component.
- `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`: Shared engine initialization/cache service.
- `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`: Confetti wrapper lifecycle logic.
- `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`: Fireworks wrapper lifecycle logic.

**Testing:**

- `apps/angular-demo/src/app/app.component.spec.ts`: Angular demo unit test example.
- `apps/ionic-demo/src/app/**/*.spec.ts`: Ionic demo page/component unit tests.
- `apps/ionic-demo/e2e/src/app.e2e-spec.ts`: Ionic e2e test entry.

## Naming Conventions

**Files:**

- Angular class files use kebab-case with role suffixes: `*.component.ts`, `*.module.ts`, `*.service.ts`, `*.routing.module.ts`, `*.spec.ts` (examples: `ng-particles.component.ts`, `tabs-routing.module.ts`).
- Public package entry file name is always `public-api.ts` in `components/*/projects/*/src/public-api.ts`.

**Directories:**

- Package roots are feature-based and lowercase hyphenated (`components/particles`, `components/confetti`, `components/fireworks`).
- Library source sits under `projects/<lib-name>/src/lib` (for example `components/particles/projects/ng-particles/src/lib`).

## Where to Add New Code

**New Feature:**

- Primary code: Add feature implementation in the relevant package under `components/<feature>/projects/<lib>/src/lib/`.
- Tests: Add/update spec files alongside app consumers in `apps/*/src/app/**/*.spec.ts` and, for library tests, in package-level test setup referenced by `components/*/angular.json`.

**New Component/Module:**

- Implementation: Create a new Angular component/module under `components/<feature>/projects/<lib>/src/lib/` and re-export from `components/<feature>/projects/<lib>/src/public-api.ts`.

**Utilities:**

- Shared helpers: Place package-scoped helpers in the same library `lib/` folder (for example `components/particles/projects/ng-particles/src/lib/`) to avoid introducing undeclared cross-package dependencies.

## Special Directories

**`components/*/dist/`:**

- Purpose: Generated publish artifacts.
- Generated: Yes.
- Committed: Yes (currently present in repository, for example `components/confetti/dist/ng-confetti`).

**`components/*/node_modules/`:**

- Purpose: Package-local dependency installations.
- Generated: Yes.
- Committed: No (dependency directory).

**`components/*/.angular/` and `.nx/`:**

- Purpose: Angular/Nx local cache and workspace data.
- Generated: Yes.
- Committed: `.nx/` is present in repo root; `.angular/` cache folders exist inside component packages.

**`.planning/codebase/`:**

- Purpose: Internal mapping artifacts consumed by planning/execution commands.
- Generated: Yes.
- Committed: Yes (intended documentation output path).

---

_Structure analysis: 2026-04-10_
