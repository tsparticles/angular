# Feature Research

**Domain:** Angular particle-effects component library
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature                                                               | Why Expected                                                                           | Complexity | Notes                                                                               |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `<ngx-particles>` component with options object input                 | This is the baseline usage pattern across tsParticles wrappers and Angular demos       | LOW        | Keep `options` strongly typed (`ISourceOptions`) and stable across Angular versions |
| Config via remote JSON URL                                            | Already standard in tsParticles docs; useful for CMS-driven themes and non-dev editing | LOW        | Support `url` + local options; document precedence rules clearly                    |
| `particlesLoaded` lifecycle output                                    | Consumers need access to `Container` for pause/refresh/destroy and imperative tweaks   | LOW        | Must emit success/failure signal safely (`undefined` on error is acceptable)        |
| Engine initialization hook/service (`particlesInit`, app-level init)  | Bundle-size control is expected (`loadSlim`/custom loaders vs full engine)             | MEDIUM     | Keep one-time app init pattern; avoid repeated feature registration                 |
| SSR safety (no browser-only execution on server)                      | Angular SSR/hybrid rendering is mainstream; browser-only libs must degrade safely      | MEDIUM     | Guard with platform checks and avoid hydration mismatch behavior                    |
| Styling and positioning controls (`containerClass`, `containerStyle`) | Most users mount particles as page background/section overlay                          | LOW        | Keep styles declarative and avoid forcing fixed/fullscreen defaults                 |
| Angular + Ionic compatibility examples                                | Project core value explicitly includes both Angular and Ionic consumers                | LOW        | Must ship working examples in docs and demo apps                                    |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature                                                                                    | Value Proposition                                                                     | Complexity | Notes                                                                         |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| Curated Angular-first presets package (hero, subtle background, celebration, CTA sparkles) | Most competitors expose raw knobs; presets reduce setup time from hours to minutes    | MEDIUM     | Build as typed factory helpers + JSON presets, not hardcoded templates        |
| Specialized components (`<ngx-confetti>`, `<ngx-fireworks>`) with trigger-oriented APIs    | Product teams often need one-shot celebration effects, not full particle scene design | MEDIUM     | Keep trigger inputs simple (`fire`, optional burst options) and SSR-safe      |
| Engine singleton with observable readiness/error state                                     | Better DX in large apps: initialize once, consume everywhere, explicit error channel  | MEDIUM     | Current `NgParticlesEngineService` is a strong base; expose cookbook patterns |
| Performance guardrails API (quality presets, auto particle caps, reduced-motion fallback)  | Prevents common production failures on low-end devices and improves accessibility     | HIGH       | Include sensible defaults, overridable by advanced users                      |
| Recipe-driven docs for Angular standalone, NgModule, SSR, and Ionic tabs/layouts           | In this niche, docs quality is a key differentiator more than raw feature count       | LOW        | Provide copy-paste-ready snippets matching current Angular patterns           |
| Migration helpers from `particles.js` configs                                              | Large installed base still has old configs; smoother migration drives adoption        | MEDIUM     | Leverage tsParticles compatibility package and documented conversion flow     |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature                                                                  | Why Requested                                     | Why Problematic                                                           | Alternative                                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Build a no-code visual editor inside the Angular package                 | Users want instant config authoring               | Bloats scope, duplicates dedicated editor tooling, slows wrapper releases | Link to external generator/editor + import JSON URL/object                  |
| Add framework-agnostic abstractions in this repo (React/Vue/Svelte APIs) | “One library for all frameworks” sounds efficient | Conflicts with stated scope and creates maintenance drag                  | Keep Angular repo Angular-only; share engine-level docs across wrappers     |
| Automatic “best performance” magic mode with opaque behavior             | Consumers want zero tuning effort                 | Hidden heuristics are unpredictable and hard to debug in production       | Expose explicit quality profiles (`low/medium/high`) + transparent defaults |
| Highly stateful visual timeline DSL in wrapper component                 | Marketing demos look attractive                   | Turns wrapper into animation platform; high complexity, low reuse         | Keep wrapper thin; defer complex choreography to app logic + engine options |

## Feature Dependencies

```
Core Angular component API (`options`/`url`/`id`)
    └──requires──> Engine initialization contract (service or init callback)
                          └──requires──> Typed option surface + docs

SSR-safe rendering
    └──requires──> Platform guards + browser-only execution boundaries

Specialized components (`ngx-confetti`, `ngx-fireworks`)
    └──enhances──> Core component offering (quick-win use cases)

Performance guardrails
    └──requires──> Container lifecycle access (`particlesLoaded`) + engine singleton

No-code editor embedding
    └──conflicts──> Thin-wrapper mission and release velocity
```

### Dependency Notes

- **Core component API requires engine initialization contract:** without deterministic init, feature plugins/presets may fail at runtime.
- **SSR safety requires platform boundaries:** tsParticles execution must remain browser-only to avoid server/hydration errors.
- **Specialized components enhance core offering:** they provide fast adoption paths while reusing the same engine ecosystem.
- **Performance guardrails require lifecycle + shared engine state:** quality adaptation depends on runtime container and predictable engine setup.
- **No-code editor conflicts with wrapper mission:** it diverts from Angular integration value into product surface area explosion.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] Core `<ngx-particles>` component with typed `options` and `url`
- [x] App-level engine init (`NgParticlesService` / engine service) and lifecycle output
- [x] SSR-safe behavior and Angular + Ionic integration examples
- [x] Basic styling/positioning API (`containerClass`, `containerStyle`)

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Curated preset helpers for common product scenarios
- [ ] Improved specialized effect APIs (confetti/fireworks trigger ergonomics)
- [ ] Performance/accessibility guardrails (`prefers-reduced-motion`, quality profiles)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Migration tooling UX (particles.js-to-tsParticles assistants, codemod-like docs)
- [ ] Optional telemetry/debug plugin for particle performance diagnostics

## Feature Prioritization Matrix

| Feature                                     | User Value | Implementation Cost | Priority          |
| ------------------------------------------- | ---------- | ------------------- | ----------------- |
| Core component API (`options`, `url`, `id`) | HIGH       | LOW                 | P1                |
| Engine init + loaded lifecycle              | HIGH       | MEDIUM              | P1                |
| SSR-safe behavior                           | HIGH       | MEDIUM              | P1                |
| Angular + Ionic examples                    | HIGH       | LOW                 | P1                |
| Curated presets                             | MEDIUM     | MEDIUM              | P2                |
| Specialized confetti/fireworks ergonomics   | MEDIUM     | MEDIUM              | P2                |
| Performance/accessibility guardrails        | HIGH       | HIGH                | P2                |
| Embedded no-code editor                     | LOW        | HIGH                | P3 (anti-feature) |

**Priority key:**

- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration (or avoid if anti-feature)

## Competitor Feature Analysis

| Feature                                  | @tsparticles/angular                            | @omnedia/ngx-particles            | Our Approach                                 |
| ---------------------------------------- | ----------------------------------------------- | --------------------------------- | -------------------------------------------- |
| Deep engine configurability              | Strong (full tsParticles option model)          | Limited (fixed interaction model) | Keep full model as default advantage         |
| Initialization strategy                  | Explicit init hooks/services for bundle control | Simpler drop-in component         | Keep explicit init, but improve starter docs |
| Specialized effects (confetti/fireworks) | Available via sibling components                | Not prominent in README           | Position as first-class quick-win components |
| SSR-aware usage                          | Present in component code via platform checks   | Not explicitly highlighted        | Make SSR guidance a top-level doc section    |

## Sources

- Project context and scope: `/Users/matteo/Projects/GitHub/tsparticles/angular/.planning/PROJECT.md` (HIGH)
- Repository usage/docs: `/Users/matteo/Projects/GitHub/tsparticles/angular/README.md` and `components/particles/projects/ng-particles/README.md` (HIGH)
- Current component/service APIs in source:
  - `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts` (HIGH)
  - `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts` (HIGH)
  - `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts` (HIGH)
  - `components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts` (HIGH)
  - `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts` (HIGH)
- Angular SSR guidance (official docs): https://angular.dev/guide/ssr (HIGH)
- tsParticles docs site (official): https://particles.js.org/docs/ (MEDIUM; docs site content is broad and version banner is ambiguous)
- Competitor reference: https://raw.githubusercontent.com/omnedia/ngx-particles/master/README.md (MEDIUM)
- Ecosystem package discovery via npm search commands (MEDIUM)

---

_Feature research for: Angular particle-effects component library_
_Researched: 2026-04-10_
