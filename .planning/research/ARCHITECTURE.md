# Architecture Research

**Domain:** Angular particle-effects component library workspace (publishable libs + demo apps)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Workspace Orchestration Layer                                              │
│ pnpm workspace + Lerna release/build + Nx task runner/cache               │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
┌───────▼───────────────────────────────┐   ┌──────────▼─────────────────────┐
│ Library Packages (publishable)        │   │ Demo Apps (consumer validation)│
│ components/particles                  │   │ apps/angular-demo              │
│ components/confetti                   │   │ apps/ionic-demo                │
│ components/fireworks                  │   │                                │
└───────┬───────────────────────────────┘   └──────────┬─────────────────────┘
        │                                              │
        │ ng-packagr outputs (dist/*)                 │ imports workspace libs
        ▼                                              ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ npm Package Surface                                                        │
│ public-api.ts exports only + APF-compliant package.json/exports           │
└────────────────────────────────────────────────────────────────────────────┘

Runtime inside consumer app:

App bootstrap → NgParticlesService / NgParticlesEngineService init →
<ngx-particles|ngx-confetti|ngx-fireworks> wrapper → tsParticles engine/effects
→ Container instance/events back to app
```

### Component Responsibilities

| Component                                                                                                  | Responsibility                                                                                        | Communicates With                                               |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Workspace Root** (`package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`)                        | Defines workspace boundaries, orchestrates build/release commands, task caching                       | All app/library package roots                                   |
| **Particles Core Library** (`components/particles`)                                                        | Core Angular wrapper API (`NgxParticlesComponent/Module`), engine init services, typed options/events | `@tsparticles/engine`, consumer apps, root orchestration        |
| **Effect Libraries** (`components/confetti`, `components/fireworks`)                                       | Effect-specific wrappers around confetti/fireworks APIs                                               | `@tsparticles/confetti`/`@tsparticles/fireworks`, consumer apps |
| **Package Build Layer** (`components/*/angular.json`, `projects/*/ng-package.json`, `scripts/prebuild.js`) | Build APF artifacts and sync package metadata pre-publish                                             | ng-packagr, package `dist/*` outputs                            |
| **Angular Demo App** (`apps/angular-demo`)                                                                 | Canonical consumer integration coverage for Angular usage patterns                                    | Workspace libraries via `workspace:^`                           |
| **Ionic Demo App** (`apps/ionic-demo`)                                                                     | Platform compatibility coverage for Ionic + Angular integration                                       | Workspace libraries via `workspace:^`, Ionic runtime            |
| **Consumer Runtime Layer** (external app projects)                                                         | Imports published package entrypoints and passes options/events                                       | npm packages exported from `dist/*`                             |

## Recommended Project Structure

```text
/
├── apps/
│   ├── angular-demo/                 # Reference Angular consumer app
│   │   ├── src/app/                  # Usage examples + regression validation
│   │   └── angular.json              # App build/test targets
│   └── ionic-demo/                   # Reference Ionic consumer app
│       ├── src/app/                  # Ionic pages consuming wrappers
│       └── angular.json
├── components/
│   ├── particles/                    # Core package (@tsparticles/angular)
│   │   ├── projects/ng-particles/src/lib/
│   │   │   ├── ng-particles.component.ts
│   │   │   ├── ng-particles.service.ts
│   │   │   └── ng-particles-engine.service.ts
│   │   ├── projects/ng-particles/src/public-api.ts
│   │   ├── scripts/prebuild.js
│   │   └── angular.json
│   ├── confetti/                     # Effect package (angular-confetti)
│   └── fireworks/                    # Effect package (angular-fireworks)
├── package.json                      # Root build/release entry commands
├── pnpm-workspace.yaml               # package discovery: apps/* + components/*
├── nx.json                           # task cache + pipeline defaults
└── lerna.json                        # package orchestration/versioning
```

### Structure Rationale

- **Separate package roots under `components/*`**: keeps publish/release boundaries explicit and avoids accidental cross-package coupling.
- **Separate validation apps under `apps/*`**: demos act as integration tests, not as part of publishable API surface.
- **`public-api.ts` gate per library**: forces intentional API exposure and prevents deep-import drift.
- **Local `angular.json` per package/app**: each package remains independently buildable, improving release reliability.

## Architectural Patterns

### Pattern 1: Core Wrapper + Effect Adapters

**What:** Keep one core particles wrapper package and separate effect-specific wrappers (confetti/fireworks).
**When to use:** Always for this domain; it preserves stable core API while allowing effect packages to evolve independently.
**Trade-offs:** More packages to release, but much cleaner ownership and fewer breaking changes.

**Example:**

```typescript
// Core API
import { NgxParticlesModule } from "@tsparticles/angular";

// Optional effect APIs
import { NgxConfettiModule } from "angular-confetti";
import { NgxFireworksModule } from "angular-fireworks";
```

### Pattern 2: Single Engine Initialization via DI Service

**What:** Initialize tsParticles engine once (application-level), then let components reuse it.
**When to use:** Default for performance and predictable runtime behavior.
**Trade-offs:** Slightly more bootstrap setup, significantly less duplicated init work.

**Example:**

```typescript
await engineService.init(async (engine) => {
  await loadFull(engine);
});
```

### Pattern 3: Public API Boundary (No Deep Imports)

**What:** Export only supported symbols from `public-api.ts`; consumers import package root only.
**When to use:** Always for maintainability and semver safety.
**Trade-offs:** Requires discipline when adding internals; pays off during refactors.

## Data Flow

### Request/Runtime Flow

```text
[App bootstrap]
    ↓
[NgParticlesService / NgParticlesEngineService.init]
    ↓
[Wrapper component input binding]
    ↓
[tsParticles engine/effect load]
    ↓
[Container instance created]
    ↓
[Output event emitted (particlesLoaded, etc.)]
    ↓
[Consumer app reacts]
```

### Build/Release Flow

```text
[Library source changes]
    ↓
[prebuild.js syncs nested package metadata]
    ↓
[ng-packagr build via package-local angular.json]
    ↓
[dist/<package> artifacts (APF)]
    ↓
[root orchestrator (Lerna/Nx) runs cross-package builds in CI]
    ↓
[publishable package outputs]
```

### Key Data Flows

1. **Configuration flow:** consumer options/url → Angular input binding → wrapper component → engine `load()`.
2. **Engine lifecycle flow:** app init callback → plugin/preset registration → shared engine ready state → component render.
3. **Release metadata flow:** package root `package.json` → prebuild sync → nested `projects/*/package.json` used in dist.

## Build Order (Roadmap Dependency Guidance)

Recommended implementation order for maintainability and release reliability:

1. **Workspace foundation**
   - Settle `pnpm` workspace boundaries, root scripts, lint/test/build conventions.
   - Add Nx task pipeline defaults (`dependsOn: ["^build"]`) to guarantee dependency build ordering in CI.

2. **Core particles package (`@tsparticles/angular`)**
   - Implement public API + wrapper component + centralized engine service.
   - This is the dependency base for docs/examples and most user adoption.

3. **Demo apps as integration contracts**
   - Wire Angular demo first, then Ionic demo.
   - Keep both consuming workspace packages (`workspace:^`) to catch breakage before publish.

4. **Effect packages (confetti, fireworks)**
   - Build as independent wrappers with the same API discipline and packaging pipeline.
   - Reuse shared conventions from core package.

5. **Release hardening**
   - Ensure APF compliance, peerDependencies correctness, changelog/version orchestration, CI reproducibility.

Dependency chain:

```text
Workspace orchestration
  → Core particles library
  → Demo apps (Angular, Ionic)
  → Effect libraries
  → Release pipeline hardening
```

## Scaling Considerations

| Scale         | Architecture Adjustments                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1-3 packages  | Current structure is sufficient; keep one public API per package and dual demos for regression checks                   |
| 4-10 packages | Add shared internal tooling package (lint configs, tsconfig presets, release scripts) to remove duplication             |
| 10+ packages  | Move to explicit Nx project graph + enforced dependency constraints/tags; add change-detection based publish automation |

### Scaling Priorities

1. **First bottleneck:** release consistency across multiple packages (fix with standardized prebuild + CI task pipelines).
2. **Second bottleneck:** API drift between packages (fix with strict public API reviews and demo app compatibility checks).

## Anti-Patterns

### Anti-Pattern 1: Per-component engine initialization

**What people do:** Call heavy engine/preset init in every wrapper instance.
**Why it's wrong:** Duplicates work, causes inconsistent behavior, increases runtime cost.
**Do this instead:** Initialize once via root DI service and reuse shared engine state.

### Anti-Pattern 2: Demo app code leaking into package API

**What people do:** Export symbols or behaviors needed only by demos.
**Why it's wrong:** Bloats public surface and creates long-term semver obligations.
**Do this instead:** Keep demos as consumers only; expose only stable library abstractions through `public-api.ts`.

### Anti-Pattern 3: Source deep-imports across package boundaries

**What people do:** Import from `projects/*/src/lib/*` directly.
**Why it's wrong:** Breaks APF boundaries and causes fragile builds.
**Do this instead:** Import only from package entrypoints.

## Integration Points

### External Services/Libraries

| Service                    | Integration Pattern                                                  | Notes                                                    |
| -------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| Angular CLI + ng-packagr   | Library build target `@angular-devkit/build-angular:ng-packagr`      | Official Angular-recommended library packaging path      |
| tsParticles engine/effects | Wrapper components call engine/effect APIs in lifecycle hooks        | Guard SSR paths with `isPlatformServer`                  |
| Nx task runner             | Optional but recommended for parallelism, caching, pipeline ordering | Use `targetDefaults` to enforce dependency order         |
| Lerna                      | Multi-package orchestration/versioning                               | Keep conventional commits + deterministic build commands |

### Internal Boundaries

| Boundary                               | Communication                                       | Notes                                                |
| -------------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| App ↔ Library                          | Angular module/component imports + Inputs/Outputs   | Consumer-facing contract; must remain stable         |
| Library Public API ↔ Library Internals | `public-api.ts` re-exports only                     | Prevent deep imports and accidental breaking changes |
| Root Orchestrator ↔ Package Build      | `pnpm` scripts invoking package-local build targets | Keep builds reproducible and package-isolated        |

## Sources

- Angular docs — Creating Libraries: https://angular.dev/tools/libraries/creating-libraries (official, current v21 docs) **[HIGH]**
- Angular docs — Angular Package Format: https://angular.dev/tools/libraries/angular-package-format (official APF guidance) **[HIGH]**
- Nx docs — Run Tasks / task pipelines: https://nx.dev/docs/features/run-tasks (official task ordering/caching guidance) **[HIGH]**
- Repository evidence:
  - `/package.json`, `/pnpm-workspace.yaml`, `/nx.json`, `/lerna.json`
  - `components/*/angular.json`, `components/*/projects/*/src/public-api.ts`
  - `components/particles/projects/ng-particles/src/lib/*`
  - `apps/angular-demo/*`, `apps/ionic-demo/*`

---

_Architecture research for: Angular particle-effects component library ecosystem_
_Researched: 2026-04-10_
