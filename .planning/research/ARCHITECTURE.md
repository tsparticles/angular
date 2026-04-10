# Architecture Research

**Domain:** tsParticles Angular v4 beta modernization inside existing monorepo (libraries + demos + release pipeline)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                           Workspace Orchestration                            │
│ Root scripts (pnpm) + Lerna package orchestration + Nx cache/task defaults  │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │
            ┌───────────────────┴───────────────────┐
            │                                       │
┌───────────▼───────────────────────┐    ┌──────────▼────────────────────────┐
│ Publishable Libraries             │    │ Integration Demos                  │
│ components/particles              │    │ apps/angular-demo                  │
│ components/confetti               │    │ apps/ionic-demo                    │
│ components/fireworks              │    │                                    │
└───────────┬───────────────────────┘    └──────────┬────────────────────────┘
            │                                         │
            │ ng-packagr (partial Ivy + APF outputs) │ imports workspace:^ libs
            ▼                                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ Distribution + Validation Surface                                             │
│ dist/ng-* packages, README sync, package metadata sync, CI build graph       │
└──────────────────────────────────────────────────────────────────────────────┘

Runtime path in consumer apps:

Bootstrap init (service) → shared tsParticles engine state → wrapper components
(`<ngx-particles>`, `<ngx-confetti>`, `<ngx-fireworks>`) → callbacks/events back to app.
```

### Component Responsibilities

| Component                                                                            | Responsibility                                           | Typical Implementation                                                                 |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Root orchestration (`/package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`) | Build/release coordination across packages and demos     | `pnpm run build`, `lerna run build --stream --no-private`, Nx `targetDefaults` caching |
| Core wrapper package (`components/particles`)                                        | Main Angular integration contract for tsParticles engine | `NgxParticlesComponent` + module + initialization services                             |
| Effect wrapper packages (`components/confetti`, `components/fireworks`)              | Effect-specific Angular adapters                         | Thin wrappers over `@tsparticles/confetti` / `@tsparticles/fireworks` lifecycle calls  |
| Prebuild sync layer (`components/*/scripts/prebuild.js`)                             | Keep nested publish metadata in sync with package root   | Version + peerDependency pinning + README copy before build                            |
| Demo contracts (`apps/angular-demo`, `apps/ionic-demo`)                              | Catch runtime and API regression before publish          | `workspace:^` imports, real app modules/pages invoking wrappers                        |
| CI pipeline (`.github/workflows/nodejs.yml`)                                         | Enforce reproducible workspace build for push/PR         | Install + prettify check + `pnpm run build:ci`                                         |

## Recommended Project Structure

```text
/
├── apps/
│   ├── angular-demo/                         # Canonical Angular integration contract
│   │   └── src/app/                          # Component/module consumption examples
│   └── ionic-demo/                           # Ionic-specific integration contract
│       └── src/app/tab1/                     # Wrapper use inside Ionic page lifecycle
├── components/
│   ├── particles/                            # Core package: @tsparticles/angular
│   │   ├── projects/ng-particles/src/lib/
│   │   │   ├── ng-particles.component.ts
│   │   │   ├── ng-particles.service.ts
│   │   │   └── ng-particles-engine.service.ts
│   │   ├── projects/ng-particles/src/public-api.ts
│   │   └── scripts/prebuild.js
│   ├── confetti/                             # Effect package: angular-confetti
│   │   ├── projects/ng-confetti/src/lib/
│   │   └── scripts/prebuild.js
│   └── fireworks/                            # Effect package: angular-fireworks
│       ├── projects/ng-fireworks/src/lib/
│       └── scripts/prebuild.js
├── package.json                              # Root orchestration scripts
├── pnpm-workspace.yaml                       # apps/* + components/* package boundaries
├── nx.json                                   # shared task cache/pipeline defaults
└── lerna.json                                # multi-package versioning conventions
```

### Structure Rationale

- **Keep wrappers package-isolated (`components/*`)** so modernization can roll out package-by-package without coupling demos to internals.
- **Treat demos as integration boundaries (`apps/*`)**, not feature code. They validate compatibility with Angular and Ionic runtime contexts.
- **Maintain `public-api.ts` as the only export gate** to avoid deep-import breakage during v4 beta iteration.
- **Retain package-local Angular build configs** (`angular.json`, `ng-package.json`) because current release flow depends on independent package builds.

## Architectural Patterns

### Pattern 1: Shared Engine Service as Default Runtime Contract

**What:** Centralize engine initialization in `NgParticlesEngineService` (newer pattern), keep legacy `NgParticlesService` for compatibility.
**When to use:** Default for all modernized examples and docs.
**Trade-offs:** Slight bootstrap complexity, major runtime consistency/perf gain.

**Example:**

```typescript
await engineService.init(async (engine) => {
  await loadSlim(engine); // or loadFull as needed
});
```

### Pattern 2: Wrapper Adapters with Stable Inputs/Outputs

**What:** Keep Angular-facing API as simple Inputs/Outputs while internally adapting to tsParticles v4 beta APIs.
**When to use:** Always at package boundaries to absorb beta API churn.
**Trade-offs:** Extra adapter code, but minimizes consumer-facing breaking changes.

**Example:**

```typescript
<ngx-particles [id]="id" [options]="particlesOptions" (particlesLoaded)="onLoaded($event)"></ngx-particles>
```

### Pattern 3: Prebuild Metadata Synchronization Before Packaging

**What:** Use `scripts/prebuild.js` per package to sync nested package version/peer deps/README before ng-packagr build.
**When to use:** Every release build.
**Trade-offs:** Small script maintenance overhead, prevents metadata drift across package roots.

## Data Flow

### Runtime Flow (modernized)

```text
[App bootstrap]
    ↓
[NgParticlesEngineService.init(...) once]
    ↓
[engine ready state published]
    ↓
[wrapper component receives options/url inputs]
    ↓
[engine.load / confetti() / fireworks()]
    ↓
[container/instance returned]
    ↓
[Angular output callback emits to consumer]
```

### Build + Release Flow (existing + modernization integration)

```text
[Source changes in components/* + apps/*]
    ↓
[package prebuild sync script]
    ↓
[package-local ng-packagr build]
    ↓
[root build orchestration via lerna/nx]
    ↓
[demo apps rebuilt against workspace:^ packages]
    ↓
[CI build:ci green]
    ↓
[release versioning/publish flow]
```

### Key Data Flows

1. **Engine init flow:** app startup init callback → plugin/preset registration → shared readiness observable → components render safely.
2. **Wrapper config flow:** template input bindings (`options`, `url`, `id`) → wrapper adapter → tsParticles runtime instance creation.
3. **Release metadata flow:** package root `package.json` → `prebuild.js` updates nested `projects/*/package.json` → dist metadata stays aligned.

## Integration Points (Requested Focus)

### Existing Architecture Connections

| Integration Point                                       | New vs Modified       | How modernization/v4 beta should connect                                                                           |
| ------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `components/particles` runtime service layer            | **Modified**          | Promote `NgParticlesEngineService` as primary path; retain `NgParticlesService` as fallback compatibility bridge   |
| `components/particles` public API                       | **Modified**          | Export engine service from `public-api.ts` so modern bootstrap pattern is first-class for consumers                |
| `components/confetti` + `components/fireworks` wrappers | **Modified**          | Align lifecycle/typing/style with modern Angular + v4 beta deps while keeping thin adapter model                   |
| Demo consumption (`apps/angular-demo`)                  | **Modified**          | Replace placeholder-heavy demo with focused wrapper usage scenarios proving centralized init + effects coexistence |
| Demo consumption (`apps/ionic-demo`)                    | **Modified**          | Add explicit init path compatible with Ionic page/module lifecycle; keep SSR-safe/runtime-safe behavior            |
| Root task orchestration (`nx.json`)                     | **Modified**          | Add `dependsOn: ["^build"]` for build targets to enforce dependency-ordered package builds                         |
| CI build (`nodejs.yml`)                                 | **Modified**          | Keep `build:ci` as single gate, but rely on ordered task pipeline to prevent race/missing dist issues              |
| Package prebuild scripts                                | **Existing retained** | Continue metadata sync, add checks to keep all `@tsparticles/*` pins at `4.0.0-beta.*` consistently                |

### Suggested New Components/Artifacts

| Artifact                                                        | Type    | Why needed                                                                                               |
| --------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `provideTsParticlesEngine(...)` helper (core package)           | **New** | Gives modern Angular bootstrap API (provider-style) without forcing manual service plumbing in every app |
| `MIGRATION.md` per package or workspace-level migration section | **New** | Makes upgrade path explicit for old `NgParticlesService` init users and module-only consumers            |
| Demo scenario matrix (Angular + Ionic)                          | **New** | Formalizes integration contracts (core-only, core+confetti, core+fireworks, lazy route/module usage)     |

> Note: `provideTsParticlesEngine` is an architectural recommendation; implementation is straightforward with current service model, but not yet present in repo.

## Build Order (dependency-aware, milestone-focused)

1. **Orchestration hardening first (root)**
   - Update Nx target pipeline ordering (`dependsOn: ["^build"]`) and verify root scripts remain stable.
   - Reason: prevents false greens when package build order matters.

2. **Core package modernization (`components/particles`)**
   - Finalize centralized engine contract + exports + typings for v4 beta.
   - Reason: demos/effect packages depend on this baseline behavior.

3. **Angular demo contract update (`apps/angular-demo`)**
   - Consume modern init pattern and verify existing wrapper functionality on current stack.
   - Reason: fastest feedback loop for mainstream consumer path.

4. **Ionic demo contract update (`apps/ionic-demo`)**
   - Validate identical contract under Ionic module/page lifecycle.
   - Reason: required compatibility target from project constraints.

5. **Effect package modernization (`components/confetti`, `components/fireworks`)**
   - Align API/lifecycle/typing and validate in both demos.
   - Reason: lower architectural risk once core init path is stable.

6. **Release-flow alignment pass**
   - Validate prebuild sync, dist outputs, CI pass, and documentation/migration updates end-to-end.
   - Reason: this milestone success criterion includes upgrade capability, not only runtime code.

Dependency summary:

```text
Root orchestration
  → Core particles package
  → Angular demo
  → Ionic demo
  → Confetti/Fireworks packages
  → Release + migration documentation hardening
```

## Anti-Patterns

### Anti-Pattern 1: Parallel initialization paths without explicit precedence

**What people do:** Keep both old/new init services active in demos/docs with no recommended default.
**Why it's wrong:** Consumers get inconsistent guidance and can double-init engine/plugins.
**Do this instead:** Document one default path (engine service/provider) and mark legacy path as compatibility-only.

### Anti-Pattern 2: Treating demos as optional marketing assets

**What people do:** Update package code but skip robust demo modernization.
**Why it's wrong:** Breakages in real Angular/Ionic integration surface only after release.
**Do this instead:** Treat demos as required integration tests in build order and CI acceptance.

### Anti-Pattern 3: Version drift across tsParticles v4 beta dependencies

**What people do:** Update only some `@tsparticles/*` packages.
**Why it's wrong:** subtle runtime/type mismatches, especially with beta APIs.
**Do this instead:** enforce synchronized beta version pins during prebuild/release checks.

## Scaling Considerations

| Scale                                 | Architecture Adjustments                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| Current (3 libs + 2 demos)            | Existing structure is appropriate; focus on stronger contracts and task ordering           |
| +More wrappers (5-10 libs)            | Add shared internal tooling/preset package for repeated ng-packagr + lint + release config |
| Ecosystem-wide multi-repo integration | Add automated compatibility matrix CI jobs consuming published canary packages             |

## Sources

- Angular docs — Creating libraries: https://angular.dev/tools/libraries/creating-libraries **[HIGH]**
- Angular docs — Angular Package Format: https://angular.dev/tools/libraries/angular-package-format **[HIGH]**
- Nx docs — Run tasks / task pipeline ordering: https://nx.dev/docs/features/run-tasks **[HIGH]**
- Repository evidence **[HIGH]**:
  - `/package.json`, `/pnpm-workspace.yaml`, `/nx.json`, `/lerna.json`
  - `/components/*/package.json`, `/components/*/projects/*/package.json`
  - `/components/particles/projects/ng-particles/src/lib/*`
  - `/components/confetti/projects/ng-confetti/src/lib/*`
  - `/components/fireworks/projects/ng-fireworks/src/lib/*`
  - `/components/*/scripts/prebuild.js`
  - `/apps/angular-demo/*`, `/apps/ionic-demo/*`
  - `/.github/workflows/nodejs.yml`

---

_Architecture research for: tsParticles Angular v4 beta modernization_
_Researched: 2026-04-10_
