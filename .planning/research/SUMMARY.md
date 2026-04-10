# Project Research Summary

**Project:** tsParticles Angular Workspace
**Domain:** Angular particle-effects component library + demo workspace
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Executive Summary

This project is a multi-package Angular integration workspace for tsParticles, with a clear mission: ship stable, APF-compliant Angular libraries (`@tsparticles/angular` plus effect wrappers) and prove real-world usage through Angular and Ionic demo apps. The research strongly supports a “thin Angular wrapper, strong integration guidance” strategy rather than building broad product surface area inside the wrapper itself.

The recommended approach is to lock the foundation first: Angular 21 + TypeScript 5.9 + Node 22 LTS, pnpm workspace boundaries, Nx for task orchestration, and ng-packagr/APF partial-Ivy publishing. Feature priorities are also clear: launch with the core `<ngx-particles>` API (`options`, `url`, lifecycle outputs), deterministic one-time engine initialization, SSR-safe behavior, and production-quality Angular/Ionic examples. Differentiators should follow in v1.x (curated presets, confetti/fireworks ergonomics, performance guardrails).

The major risks are implementation-consistency risks, not novelty risks: split engine init paths, SSR/hydration regressions, zone-driven performance storms, and long-session leaks. Mitigation is explicit in the research: enforce one canonical init contract, test multi-instance and SSR/hydration paths in CI, run animations outside Angular zone, and add endurance/lifecycle cleanup tests before claiming stability.

## Key Findings

### Recommended Stack

Research converges on an up-to-date, standards-aligned Angular library toolchain. Angular 21.2.x + ng-packagr 21.x + APF partial-Ivy is the non-negotiable publishing path, with TS pinned to 5.9.x (`<6.0`) for compatibility. Node 22.12+ LTS and pnpm 10 workspaces provide deterministic installs and CI reliability, while Nx should be the primary task runner for affected builds and caching.

**Core technologies:**

- **Angular 21.2.x**: framework + library tooling baseline — aligned with official APF/partial-Ivy library guidance.
- **TypeScript 5.9.x (`<6.0`)**: compile target for Angular 21 compatibility — avoids premature TS 6 breakage.
- **Node 22.12+ LTS**: CI/runtime baseline — within Angular-supported range and safest operational default.
- **pnpm workspaces 10.x**: monorepo dependency graph and reproducibility — strict workspace linking and single lockfile discipline.
- **Nx 22.x**: orchestration/caching/affected runs — improves multi-package CI efficiency and dependency-aware execution.
- **ng-packagr 21.x**: APF-compliant packaging — official Angular library distribution path.
- **tsParticles 3.x packages** (`@tsparticles/engine`, `@tsparticles/angular`, `@tsparticles/slim`): runtime integration core — consistent 3.x alignment for wrapper + engine ecosystem.

### Expected Features

The launch bar is practical and integration-first: stable component API, robust engine init, SSR safety, and clear cross-platform examples. Competitive edge should come from developer experience (presets, recipes, guardrails), not from expanding scope into editor-like tooling.

**Must have (table stakes):**

- Core `<ngx-particles>` API with typed `options`, `url`, and stable lifecycle output (`particlesLoaded`).
- App-level engine initialization contract (single, deterministic init path).
- SSR-safe execution boundaries and hydration-safe rendering behavior.
- Styling/positioning controls (`containerClass`, `containerStyle`).
- Angular + Ionic working examples/documentation.

**Should have (competitive):**

- Curated Angular-first presets (hero/subtle/celebration use cases).
- Simplified trigger-oriented effect components (`ngx-confetti`, `ngx-fireworks`).
- Engine singleton readiness/error patterns for large apps.
- Performance/accessibility guardrails (quality profiles, reduced-motion handling).

**Defer (v2+):**

- Migration UX/tooling depth from legacy particles.js configurations.
- Optional telemetry/debug diagnostics plugin.
- Any embedded no-code visual editor (explicit anti-feature for this repo scope).

### Architecture Approach

The architecture should remain package-centric and boundary-driven: publishable libraries under `components/*`, validation consumers under `apps/*`, and strict API exposure through `public-api.ts` only. Runtime design should use one shared engine lifecycle via DI service and effect-specific adapters layered on top of a stable core wrapper. Build/release flow should enforce package-local builds, APF outputs, and root-level orchestration through pnpm + Nx (+ Lerna for release/version orchestration where already established).

**Major components:**

1. **Workspace orchestration layer** — defines package boundaries and deterministic build/release pipelines.
2. **Core particles library** — owns Angular wrapper API, initialization services, lifecycle/event contract.
3. **Effect libraries (confetti/fireworks)** — optional adapters for common outcomes without bloating core API.
4. **Demo apps (Angular + Ionic)** — consumer-facing integration contracts and regression validation surfaces.
5. **Package build layer** — APF artifact production and metadata synchronization pre-publish.

### Critical Pitfalls

1. **Engine init race / duplicate registration** — enforce one canonical init service, idempotent init, and multi-instance integration tests.
2. **SSR/hydration breakage** — hard platform guards + browser-only startup timing, plus SSR/hydration CI checks.
3. **Zone pollution performance storms** — run animation loops outside Angular zone; re-enter only for explicit outputs.
4. **Version drift (Angular/wrapper/engine)** — maintain compatibility matrix and gate releases with matrix CI.
5. **Long-session memory/CPU leaks** — full teardown + endurance navigation tests + safe default pause behavior.

## Implications for Roadmap

Based on combined research, suggested phase structure:

### Phase 0: Release Baseline & Compatibility Policy

**Rationale:** Packaging/version drift is a high-impact failure mode and should be fixed before feature expansion.
**Delivers:** Compatibility matrix, peerDependency policy, deterministic build/release scripts, CI matrix baseline.
**Addresses:** Feature requirement for reliable install/use across Angular versions.
**Avoids:** Pitfall 4 (version drift).

### Phase 1: Core Engine Lifecycle & Wrapper Contract

**Rationale:** All higher-level features depend on a correct, single engine initialization model.
**Delivers:** Canonical init path, typed core component API (`options`, `url`, `id`), lifecycle outputs, multi-instance correctness.
**Addresses:** P1 features (core API + init + lifecycle).
**Avoids:** Pitfall 1 (init race), Pitfall 3 (zone pollution).

### Phase 2: Rendering Compatibility, Safety & UX Defaults

**Rationale:** SSR/hydration and configuration safety are mandatory for modern Angular adoption.
**Delivers:** SSR-safe runtime behavior, hydration-safe templates, remote JSON validation/host policy, reduced-motion + click-through defaults.
**Uses:** Angular SSR guidance, platform guards, browser-only hooks.
**Implements:** Architecture boundary between runtime wrapper and hosting app environment.
**Avoids:** Pitfall 2 (SSR breakage), config/security gotchas, UX layering pitfalls.

### Phase 3: Demo-Driven Integration Hardening (Angular + Ionic)

**Rationale:** Demo apps are architectural contracts and should validate real consumer scenarios early.
**Delivers:** Canonical Angular demo + Ionic demo workflows, cross-browser smoke coverage, route endurance tests.
**Addresses:** P1 requirement for Angular/Ionic examples and stability validation.
**Avoids:** Pitfall 5 (long-session leaks), regression-by-example drift.

### Phase 4: Differentiators (Presets, Effect Ergonomics, Guardrails)

**Rationale:** Once baseline reliability is proven, invest in DX differentiators that accelerate adoption.
**Delivers:** Curated presets, ergonomic confetti/fireworks triggers, explicit quality profiles.
**Addresses:** P2 features from FEATURES.md.
**Avoids:** Anti-features (embedded editor, opaque “magic mode”, framework-agnostic scope creep).

### Phase Ordering Rationale

- Ordering follows hard dependencies: release policy → core init contract → SSR/safety → integration hardening → DX differentiation.
- Grouping mirrors architecture boundaries: package/release concerns first, then runtime API correctness, then consumer-surface validation.
- This sequence reduces the top known failure modes before adding complexity.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 2:** SSR/hydration edge cases, remote JSON validation/security constraints, and reduced-motion behavior need scenario-specific acceptance criteria.
- **Phase 4:** Performance guardrails require benchmark thresholds (mobile/device-class tuning) and may need targeted profiling research.

Phases with standard patterns (can likely skip deep research-phase):

- **Phase 0:** APF/peerDependency/release matrix patterns are well-documented by Angular docs and existing monorepo conventions.
- **Phase 1:** Core wrapper + single init DI pattern is already established in repo and architecture research.
- **Phase 3:** Demo-app-as-contract pattern is well understood and directly supported by existing workspace structure.

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                      |
| ------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Grounded in official Angular compatibility/APF docs and npm version metadata.                                              |
| Features     | MEDIUM     | Strong repo-context alignment, but differentiator prioritization includes product judgment.                                |
| Architecture | HIGH       | Backed by concrete repository structure plus standard Angular/Nx package patterns.                                         |
| Pitfalls     | MEDIUM     | High-quality Angular best-practice sources, but domain-specific failure frequency partly inferred from ecosystem patterns. |

**Overall confidence:** MEDIUM

### Gaps to Address

- **Canonical init migration plan:** Two init paths exist; define deprecation timeline and guard behavior explicitly during planning.
- **Remote JSON trust model:** Host allowlist/schema validation/size-time limits need concrete implementation decisions.
- **Performance guardrail thresholds:** Default particle/fps/device-class profiles require benchmark-driven tuning.
- **Compatibility automation depth:** Decide exact CI matrix scope (Angular majors, Node versions, browser targets).
- **SSR proof coverage:** Confirm which demos/tests run full SSR + hydration checks pre-release.

## Sources

### Primary (HIGH confidence)

- Angular version compatibility: https://angular.dev/reference/versions
- Angular library creation guidance: https://angular.dev/tools/libraries/creating-libraries
- Angular Package Format (APF): https://angular.dev/tools/libraries/angular-package-format
- Angular SSR guide: https://angular.dev/guide/ssr
- Angular lifecycle + NgZone best practices: https://angular.dev/guide/components/lifecycle, https://angular.dev/api/core/NgZone, https://angular.dev/best-practices/zone-pollution
- Workspace repository evidence: `.planning/PROJECT.md`, root workspace configs, component/demo source and READMEs

### Secondary (MEDIUM confidence)

- Nx task orchestration docs: https://nx.dev/docs/features/run-tasks
- Lerna docs (orchestration/versioning context): https://lerna.js.org/
- Playwright docs: https://playwright.dev/docs/intro
- Ionic Angular overview: https://ionicframework.com/docs/angular/overview
- tsParticles docs interface references: https://particles.js.org/docs/

### Tertiary (LOW confidence)

- Competitor README comparisons and ecosystem package discovery snapshots (directional only; validate during implementation).

---

_Research completed: 2026-04-10_
_Ready for roadmap: yes_
