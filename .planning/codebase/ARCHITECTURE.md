# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo with package-oriented Angular architecture (workspace root + independently buildable app/library packages).

**Key Characteristics:**

- Keep each deliverable in its own package root under `apps/*` or `components/*` and build it independently with local `angular.json` and `package.json` files (for example `apps/angular-demo/angular.json`, `components/particles/angular.json`).
- Expose Angular libraries through a strict public API surface in `projects/*/src/public-api.ts` (for example `components/particles/projects/ng-particles/src/public-api.ts`).
- Use Angular DI services to centralize tsParticles engine initialization and share runtime state across component instances (`components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`).

## Layers

**Workspace Orchestration Layer:**

- Purpose: Coordinate multi-package builds, versioning, and shared tooling.
- Location: `package.json`, `pnpm-workspace.yaml`, `nx.json`, `lerna.json`
- Contains: Root scripts (`build`, `build:ci`, `build:lerna`, `build:nx`), workspace package definitions, Nx target cache defaults.
- Depends on: `pnpm`, `lerna`, `nx` from root dependencies in `package.json`.
- Used by: All packages under `apps/*` and `components/*`.

**Application Layer (Consumer Demos):**

- Purpose: Demonstrate and validate package usage in real Angular/Ionic apps.
- Location: `apps/angular-demo/src`, `apps/ionic-demo/src`
- Contains: App bootstrap (`src/main.ts`), root modules (`src/app/app.module.ts`), templates/pages and routing modules.
- Depends on: Published workspace libraries (`@tsparticles/angular`, `angular-confetti`, `angular-fireworks`) and Angular/Ionic frameworks.
- Used by: Developers validating component behavior and integration flows.

**Library API Layer:**

- Purpose: Define the consumable Angular modules/components exported to downstream apps.
- Location: `components/*/projects/*/src/public-api.ts`
- Contains: Public exports only (`NgxParticlesComponent`, `NgxParticlesModule`, `NgxConfettiComponent`, `NgxFireworksComponent`).
- Depends on: Internal `lib/*` implementations.
- Used by: Application modules importing package entry points (for example `apps/angular-demo/src/app/app.module.ts`).

**Library Implementation Layer:**

- Purpose: Implement framework adapters around tsParticles engines/effects.
- Location: `components/particles/projects/ng-particles/src/lib`, `components/confetti/projects/ng-confetti/src/lib`, `components/fireworks/projects/ng-fireworks/src/lib`
- Contains: Angular components, modules, and lifecycle-based integration logic.
- Depends on: `@tsparticles/*` runtime packages and Angular core/common APIs.
- Used by: Public API layer and downstream applications.

**Build Packaging Layer:**

- Purpose: Produce distributable Angular package artifacts.
- Location: `components/*/projects/*/ng-package.json`, `components/*/angular.json`, `components/*/scripts/prebuild.js`
- Contains: ng-packagr entry configuration, project build targets, prebuild metadata synchronization scripts.
- Depends on: Angular CLI builders (`@angular-devkit/build-angular:ng-packagr`) and Node filesystem operations.
- Used by: Package build scripts in each component package (`components/*/package.json`).

## Data Flow

**Flow Name: App bootstrap to rendered particles instance**

1. Angular bootstraps the app module from `apps/angular-demo/src/main.ts` or `apps/ionic-demo/src/main.ts`.
2. Root component initializes engine capabilities through `NgParticlesService.init(...)` in `apps/angular-demo/src/app/app.component.ts` or `apps/ionic-demo/src/app/app.component.ts`.
3. Feature template renders `<ngx-particles>` / `<ngx-confetti>` / `<ngx-fireworks>` in `apps/angular-demo/src/app/app.component.html` or `apps/ionic-demo/src/app/tab1/tab1.page.html`.
4. Library component lifecycle (`ngOnInit`/`ngAfterViewInit`) loads runtime container/effect from `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`, or `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`.
5. Load completion is emitted back to consumers via outputs such as `particlesLoaded` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`.

**State Management:**

- Prefer service-based state for engine readiness and initialization status using `BehaviorSubject` in `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts` and `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`.
- Keep component-local UI state as class fields (`particlesVisible`, `fire`, `fireworksVisible`) in app components such as `apps/angular-demo/src/app/app.component.ts`.

## Key Abstractions

**Angular Wrapper Component Abstraction:**

- Purpose: Bridge Angular templates to tsParticles runtime calls.
- Examples: `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`, `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`
- Pattern: Inputs configure runtime options; Angular lifecycle hooks trigger runtime load; destroy lifecycle tears down containers/instances.

**Engine Initialization Service Abstraction:**

- Purpose: Ensure one-time engine setup and readiness signaling.
- Examples: `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts`
- Pattern: Singleton `providedIn: "root"` service with observable readiness + cached initialization promise.

**Public Surface Abstraction:**

- Purpose: Isolate external API from internal file layout.
- Examples: `components/particles/projects/ng-particles/src/public-api.ts`, `components/confetti/projects/ng-confetti/src/public-api.ts`, `components/fireworks/projects/ng-fireworks/src/public-api.ts`
- Pattern: Re-export module/component symbols from one entry file consumed by ng-packagr.

## Entry Points

**Root Workspace Entry Point:**

- Location: `package.json`
- Triggers: `pnpm run build` / `pnpm run build:ci` from repo root.
- Responsibilities: Dispatch workspace-wide build orchestration through Lerna/Nx scripts.

**Angular Demo App Entry Point:**

- Location: `apps/angular-demo/src/main.ts`
- Triggers: Angular CLI serve/build targets from `apps/angular-demo/angular.json`.
- Responsibilities: Bootstrap `AppModule`, switch prod mode via environment.

**Ionic Demo App Entry Point:**

- Location: `apps/ionic-demo/src/main.ts`
- Triggers: Angular/Ionic build and serve targets from `apps/ionic-demo/angular.json`.
- Responsibilities: Bootstrap Ionic Angular app module and route to lazy tabs module.

**Library Package Entry Points:**

- Location: `components/*/projects/*/src/public-api.ts`
- Triggers: ng-packagr builds configured in `components/*/projects/*/ng-package.json`.
- Responsibilities: Define exported symbols for npm consumers.

## Error Handling

**Strategy:** Guard SSR environments and wrap async runtime initialization in explicit try/catch where engine loading can fail.

**Patterns:**

- Use `isPlatformServer(...)` guards before DOM/runtime execution in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`, `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`, and `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`.
- Emit fallback state and log failures when loading fails (`console.error("Failed to load particles:", error)` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).

## Cross-Cutting Concerns

**Logging:** Console logging is used directly for init/load visibility in `apps/angular-demo/src/app/app.component.ts`, `apps/ionic-demo/src/app/app.component.ts`, and library error paths in `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`.
**Validation:** Type-level validation via TypeScript option types (`ISourceOptions`, `ConfettiOptions`, `FireworkOptions`) in component input contracts.
**Authentication:** Not applicable; no auth layer is implemented in this repository.

---

_Architecture analysis: 2026-04-10_
