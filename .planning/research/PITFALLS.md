# Pitfalls Research

**Domain:** Angular particle/animation wrapper libraries (tsParticles-style integration)
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Engine initialization race + duplicate registration

**What goes wrong:**
Multiple components initialize or register plugins independently, causing duplicate plugin registration, inconsistent behavior between instances, and hard-to-reproduce runtime errors.

**Why it happens:**
Wrapper authors treat each `<ngx-particles>` as self-contained instead of sharing a single engine lifecycle. In this repo, there are two initialization paths (`NgParticlesService` and `NgParticlesEngineService`), which increases accidental split-brain usage risk.

**How to avoid:**

- Define one canonical bootstrap path (engine service first, legacy service as compatibility only).
- Make init idempotent and awaitable across all callers.
- Add runtime guard: throw/warn if both service paths are used in same app.
- Add integration tests with 2+ particle components mounted simultaneously.

**Warning signs:**

- "Works in one component, breaks with two"
- Random missing shapes/interactions after route changes
- Duplicate initialization logs / repeated `loadSlim` traces

**Phase to address:**
Phase 1 — Core engine lifecycle and API contract

---

### Pitfall 2: SSR/hydration breakage from browser-only assumptions

**What goes wrong:**
Libraries crash or hydrate incorrectly in Angular SSR/hybrid apps when touching DOM/browser APIs too early (`window`, `document`, canvas calls during server render).

**Why it happens:**
Canvas wrappers are usually authored in CSR-first style; maintainers forget Angular now strongly supports SSR/hybrid rendering and hydration.

**How to avoid:**

- Keep strict platform guards (`isPlatformServer` / platform-specific providers).
- Move browser-only startup to post-render hooks (`afterNextRender`) or guarded `AfterViewInit` paths.
- Test demo apps in CSR + SSR build modes before releases.
- Never branch template output with `isPlatformBrowser` checks that cause hydration mismatch.

**Warning signs:**

- Hydration mismatch warnings in Angular logs
- Server build passes but first request crashes
- DOM access errors in Node runtime

**Phase to address:**
Phase 2 — Rendering-mode compatibility (CSR/SSR/hydration)

---

### Pitfall 3: Zone pollution causing app-wide change-detection storms

**What goes wrong:**
Animation loops/events trigger Angular change detection continuously, degrading performance of unrelated parts of the app.

**Why it happens:**
Third-party animation engines schedule timers, RAF callbacks, and event listeners. If initialized inside Angular zone, every tick can trigger checks.

**How to avoid:**

- Initialize and run animation loops in `ngZone.runOutsideAngular`.
- Re-enter zone only for explicit outputs (`particlesLoaded`, user events).
- Add perf budget checks with Angular DevTools profiling in demos.

**Warning signs:**

- Angular DevTools shows dense consecutive checks sourced from timers/events
- CPU spikes while idle route is open
- Typing/scroll stutter in unrelated components

**Phase to address:**
Phase 1 — Runtime performance baseline

---

### Pitfall 4: Version drift between Angular, wrapper, and engine packages

**What goes wrong:**
Consumers hit install conflicts or runtime incompatibilities because peer dependencies and published versions lag framework/ecosystem releases.

**Why it happens:**
Wrapper packages are often thin, so maintainers delay releases. But Angular library compatibility and tsParticles engine/plugin versions move independently.

**How to avoid:**

- Maintain explicit compatibility matrix (Angular major × `@tsparticles/angular` × engine/plugins).
- Gate CI with matrix tests on supported Angular majors.
- Align peerDependencies with tested ranges and publish promptly after compatibility validation.

**Warning signs:**

- Open issues like "works on Angular X but not X+1"
- npm install peer warning spikes
- Consumers pinning old versions in workarounds

**Phase to address:**
Phase 0 — Packaging/release policy before feature expansion

---

### Pitfall 5: Unbounded memory/CPU over long sessions

**What goes wrong:**
Particle containers continue running after route changes, subscriptions accumulate, and tab performance degrades over time.

**Why it happens:**
Wrappers clean up container state partially but miss RxJS subscription cleanup, re-init churn, or visibility pause strategies.

**How to avoid:**

- Ensure full teardown on destroy (container + subscriptions + listeners).
- Use one-shot subscriptions (`take(1)`/equivalent) for init readiness signals.
- Document and default `pauseOnBlur`/`pauseOnOutsideViewport` behavior for background effects.
- Add endurance test: route in/out 100x, confirm no retained containers/subscriptions.

**Warning signs:**

- Memory profile climbs after repeated navigation
- FPS steadily drops after several minutes
- Duplicate callback emissions from a single component instance

**Phase to address:**
Phase 3 — Stability hardening and lifecycle audits

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut                                            | Immediate Benefit      | Long-term Cost                                            | When Acceptable                          |
| --------------------------------------------------- | ---------------------- | --------------------------------------------------------- | ---------------------------------------- |
| "Just call `loadFull` everywhere"                   | Fast demo success      | Significant bundle bloat and poor mobile performance      | MVP demos only; not production defaults  |
| Keep both old/new init APIs indefinitely            | Backward compatibility | Confusing docs, split usage patterns, support burden      | Temporary only with deprecation timeline |
| Skip SSR tests for wrapper package                  | Faster CI              | Breakage for Angular SSR adopters discovered post-release | Never for official integration package   |
| Rely on runtime docs only (no compatibility matrix) | Less maintenance docs  | High support load during Angular major updates            | Never                                    |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration                      | Common Mistake                                                 | Correct Approach                                                              |
| -------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Remote JSON config (`url`)       | Loading unversioned or cross-origin configs without validation | Version configs, enforce CORS expectations, validate schema before load       |
| Ionic + Angular shells           | Assuming standard viewport/layer behavior                      | Provide Ionic-specific layout examples (`ion-content`, z-index/pointer rules) |
| Angular SSR                      | Executing engine setup during server render                    | Browser-only init path + SSR smoke tests in CI                                |
| Nx/Lerna/pnpm monorepo consumers | Building against source path hacks                             | Consume built package entrypoints, keep APF-compatible distribution           |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap                                               | Symptoms                             | Prevention                                              | When It Breaks                   |
| -------------------------------------------------- | ------------------------------------ | ------------------------------------------------------- | -------------------------------- |
| High particle count + high `fpsLimit` defaults     | Battery drain, thermal throttling    | Conservative defaults + presets by device class         | Mid-range mobile devices quickly |
| Fullscreen canvas with frequent style/layout churn | Jank during resize/route transitions | Keep canvas container stable; avoid repeated DOM writes | Multi-widget landing pages       |
| Running animations in hidden tabs/routes           | Background CPU usage                 | Default pause on blur/out-of-viewport                   | Long-lived enterprise dashboards |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake                                        | Risk                                                            | Prevention                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Trusting arbitrary remote options JSON         | Malicious/unexpected config behavior, degraded UX/DoS-like load | Restrict allowed config hosts, validate option shape, set size/time limits |
| Overexposing plugin extensibility without docs | Consumers load unsafe/unreviewed code paths                     | Provide curated plugin loading guidance and security notes                 |
| Silent fallback on malformed config            | Hidden unsafe defaults and debugging blind spots                | Fail fast with explicit errors and typed validation feedback               |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall                            | User Impact                                             | Better Approach                                                                 |
| ---------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Particle layer intercepts clicks   | Broken navigation/forms                                 | Default `pointer-events: none` for decorative backgrounds                       |
| Ignoring reduced-motion preference | Motion-sensitive users harmed; accessibility complaints | Provide reduced/disabled animation mode and document it                         |
| One-size-fits-all presets          | Overly noisy visuals or low contrast                    | Ship curated presets by use-case (hero background, subtle ambient, celebration) |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Engine init:** Works with multiple components/routes, not just single demo page
- [ ] **SSR compatibility:** No server-side DOM access, hydration warnings resolved
- [ ] **Lifecycle cleanup:** No retained containers/subscriptions after component destroy
- [ ] **Performance defaults:** Mobile-safe particle count/fps and pause behavior validated
- [ ] **Release compatibility:** Angular + engine version matrix published and tested
- [ ] **Accessibility:** Reduced-motion and interaction-layer behavior documented

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall                            | Recovery Cost | Recovery Steps                                                                            |
| ---------------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| Init race / duplicate engine setup | MEDIUM        | Introduce single engine authority service, deprecate alternate path, ship migration guide |
| SSR/hydration breakage             | HIGH          | Patch with guarded initialization, add SSR E2E gate, release hotfix quickly               |
| Zone pollution regressions         | MEDIUM        | Move callbacks outside zone, profile before/after, add perf regression checks             |
| Version drift release failures     | HIGH          | Freeze support matrix, patch peer ranges, backport compatibility notes                    |
| Memory leak after navigation       | MEDIUM        | Add teardown audit, fix subscription/container cleanup, publish patch with test           |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall                                             | Prevention Phase                    | Verification                                                       |
| --------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Engine initialization race + duplicate registration | Phase 1 (Core engine lifecycle)     | Multi-instance integration test passes without duplicate init/logs |
| SSR/hydration browser-only assumptions              | Phase 2 (Rendering compatibility)   | SSR build + hydrate run with zero DOM-access/mismatch errors       |
| Zone pollution from animation tasks                 | Phase 1 (Performance baseline)      | Angular DevTools shows no timer-driven global detection storm      |
| Version drift across Angular/engine/wrapper         | Phase 0 (Release policy)            | Compatibility matrix in docs + CI matrix green                     |
| Memory/CPU leaks across navigation                  | Phase 3 (Stability hardening)       | Endurance navigation test shows stable memory and container count  |
| Remote JSON config trust/validation gaps            | Phase 2 (Configuration safety)      | Invalid/oversized/blocked-host config cases fail predictably       |
| UX layering + reduced-motion misses                 | Phase 2 (UX/accessibility defaults) | Click-through and reduced-motion acceptance tests pass             |

## Sources

- Angular SSR and server-compatible authoring guidance (official): https://angular.dev/guide/ssr _(HIGH)_
- Angular component lifecycle and destroy guidance (official): https://angular.dev/guide/components/lifecycle _(HIGH)_
- Angular NgZone API + zone pollution best practices (official): https://angular.dev/api/core/NgZone and https://angular.dev/best-practices/zone-pollution _(HIGH)_
- Angular library packaging and peer dependency guidance (official): https://angular.dev/tools/libraries/creating-libraries _(HIGH)_
- tsParticles options interface (pause/retina/fps/fullscreen etc.): https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html _(MEDIUM — docs site version labeling is inconsistent)_
- Repository implementation context (`NgxParticlesComponent`, services, package metadata): local code in this workspace and README _(HIGH for observed code paths)_
- npm package publish status for `@tsparticles/angular` (version recency): https://www.npmjs.com/package/@tsparticles/angular _(MEDIUM)_

---

_Pitfalls research for: Angular particle-effects component library domain_
_Researched: 2026-04-10_
