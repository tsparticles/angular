# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Duplicated package metadata and prebuild sync scripts:**

- Issue: Library metadata is duplicated between root component packages and publishable package manifests, then synchronized by ad-hoc Node scripts.
- Files: `components/particles/package.json`, `components/particles/projects/ng-particles/package.json`, `components/particles/scripts/prebuild.js`, `components/confetti/package.json`, `components/confetti/projects/ng-confetti/package.json`, `components/confetti/scripts/prebuild.js`, `components/fireworks/package.json`, `components/fireworks/projects/ng-fireworks/package.json`, `components/fireworks/scripts/prebuild.js`
- Impact: Metadata drift is likely when scripts are not run consistently; publish-time mistakes can ship wrong peer dependency ranges, repository metadata, or versions.
- Fix approach: Replace duplication with a single source of truth (workspace release tooling or generated publish manifests in CI) and fail CI when generated manifests differ.

**Mixed legacy and modern build orchestration:**

- Issue: The workspace combines Nx + Lerna orchestration, while app-level Angular CLI configs remain standalone.
- Files: `package.json`, `nx.json`, `lerna.json`, `apps/angular-demo/angular.json`, `apps/ionic-demo/angular.json`, `components/particles/angular.json`, `components/confetti/angular.json`, `components/fireworks/angular.json`
- Impact: Build logic is split across multiple systems, increasing maintenance cost and causing drift in target behavior and caching.
- Fix approach: Consolidate on one orchestrator for CI and local builds, with explicit per-project targets and shared defaults.

## Known Bugs

**`angular-demo` unit tests are inconsistent with component implementation:**

- Symptoms: Specs assert title `ng-particles-demo` and matching rendered text, but component uses title `angular`.
- Files: `apps/angular-demo/src/app/app.component.spec.ts`, `apps/angular-demo/src/app/app.component.ts`, `apps/angular-demo/src/app/app.component.html`
- Trigger: Run the `apps/angular-demo` test target (`ng test` in `apps/angular-demo`).
- Workaround: Align spec expectations to current component values or update `AppComponent.title` and template content to the tested contract.

**Published metadata points to incorrect package directory for fireworks library:**

- Symptoms: Fireworks library manifest identifies confetti repository directory/homepage.
- Files: `components/fireworks/projects/ng-fireworks/package.json`
- Trigger: Inspect published metadata fields `repository.directory` and `homepage`.
- Workaround: Set `repository.directory` to `components/fireworks` and a fireworks-specific homepage before publish.

## Security Considerations

**Unpinned beta ecosystem dependencies in public libraries:**

- Risk: Extensive use of beta package lines expands supply-chain instability and increases accidental breaking changes.
- Files: `components/particles/package.json`, `components/confetti/package.json`, `components/fireworks/package.json`, `apps/angular-demo/package.json`, `apps/ionic-demo/package.json`
- Current mitigation: Versions are explicitly declared in manifests.
- Recommendations: Pin to tested stable releases for publishable packages and gate upgrades behind automated compatibility tests.

**No dedicated secret handling surface detected:**

- Risk: Not applicable for runtime secret leakage in current code paths; codebase is client/UI package focused.
- Files: `apps/angular-demo/src/main.ts`, `apps/ionic-demo/src/main.ts`, `components/**/src/**/*.ts`
- Current mitigation: No secret files are consumed in source paths analyzed.
- Recommendations: Keep secret material out of client bundles and enforce `.env*` exclusion policy in CI checks.

## Performance Bottlenecks

**Large default Angular template shipped in demo app:**

- Problem: Demo includes a 900+ line placeholder template with large inline CSS and SVG payload.
- Files: `apps/angular-demo/src/app/app.component.html`
- Cause: Generated Angular starter content remains embedded in runtime demo page.
- Improvement path: Replace with minimal showcase template dedicated to particles/confetti/fireworks examples.

**Very permissive production bundle budget in Ionic demo:**

- Problem: Initial bundle budget allows up to 50 MB error threshold.
- Files: `apps/ionic-demo/angular.json`
- Cause: Production budget is configured with very high limits (`maximumWarning: 20mb`, `maximumError: 50mb`).
- Improvement path: Reduce budget thresholds and split demo dependencies to lazy/optional loading.

## Fragile Areas

**Engine initialization and component load lifecycle coupling:**

- Files: `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts`
- Why fragile: `NgxParticlesComponent` supports two initialization paths (`NgParticlesService` and `NgParticlesEngineService`) and subscribes without explicit unsubscription, increasing lifecycle complexity and leak risk.
- Safe modification: Keep one initialization path per app, add teardown-safe subscription handling (`takeUntilDestroyed` or equivalent), and add lifecycle regression tests before altering init flow.
- Test coverage: No component library specs are present under `components/**/src/lib/**/*.spec.ts`.

**Legacy e2e stack in Ionic app:**

- Files: `apps/ionic-demo/e2e/protractor.conf.js`, `apps/ionic-demo/e2e/src/app.e2e-spec.ts`, `apps/ionic-demo/angular.json`, `apps/ionic-demo/package.json`
- Why fragile: Protractor-based e2e is legacy and minimally covered (single smoke assertion).
- Safe modification: Migrate to a maintained e2e runner (Playwright/Cypress) and preserve one stable end-to-end smoke path per tab route.
- Test coverage: Only one e2e test (`should display welcome message`) is implemented.

## Scaling Limits

**Demo app dependency footprint scales poorly with additional effects/plugins:**

- Current capacity: Demo apps directly include a broad set of tsParticles plugins and shapes in runtime dependencies.
- Limit: Bundle size and startup time degrade as additional packages are added to already large dependency sets.
- Scaling path: Move rarely-used plugin bundles behind dynamic imports and provide prebuilt presets for common scenarios.

## Dependencies at Risk

**Angular peer compatibility range mismatch:**

- Risk: Published peer dependency for `@angular/core` in ng-particles excludes Angular 20/21 while workspace apps consume Angular 21.
- Impact: Consumer installations on Angular 20/21 can receive peer dependency warnings or blocked installs.
- Migration plan: Update `peerDependencies` in `components/particles/projects/ng-particles/package.json` to include supported Angular major range validated by CI.

**Deprecated GitHub Actions output command usage:**

- Risk: Workflow uses `::set-output`, which is deprecated.
- Impact: CI behavior is brittle against GitHub Actions runtime changes.
- Migration plan: Replace with `$GITHUB_OUTPUT` file writes in `.github/workflows/nodejs.yml`.

## Missing Critical Features

**No automated tests for publishable component libraries:**

- Problem: Library source (`ng-particles`, `ng-confetti`, `ng-fireworks`) has no `.spec.ts` tests despite test configuration scaffolding.
- Blocks: Safe refactoring of lifecycle, SSR guards, and engine initialization behavior for published components.

## Test Coverage Gaps

**Core component behavior is untested:**

- What's not tested: Lifecycle and initialization semantics for `NgxParticlesComponent`, `NgParticlesEngineService`, `NgxConfettiComponent`, and `NgxFireworksComponent`.
- Files: `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`, `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`, `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`
- Risk: Regressions in SSR handling, teardown behavior, and async initialization can pass unnoticed.
- Priority: High

**Ionic app tests are mostly boilerplate smoke checks:**

- What's not tested: tsParticles integration logic in `AppComponent` and `Tab1Page` interaction behavior.
- Files: `apps/ionic-demo/src/app/app.component.ts`, `apps/ionic-demo/src/app/tab1/tab1.page.ts`, `apps/ionic-demo/src/app/app.component.spec.ts`, `apps/ionic-demo/src/app/tab1/tab1.page.spec.ts`
- Risk: Runtime integration failures are likely to surface only manually.
- Priority: Medium

---

_Concerns audit: 2026-04-10_
