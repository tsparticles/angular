# Requirements: tsParticles Angular Workspace

**Defined:** 2026-04-10
**Core Value:** Angular developers can add reliable, customizable tsParticles effects quickly using first-class Angular packages.

## v1 Requirements

Requirements for the current milestone (v2.0). Each maps to roadmap phases.

### Dependency Policy

- [x] **DEPS-01**: Maintainer can use tsParticles `4.0.0-beta` packages consistently across all Angular workspace packages.
- [x] **DEPS-02**: Maintainer can enforce one dependency policy that prevents mixed tsParticles major versions in the workspace.
- [x] **DEPS-03**: Maintainer can verify in CI that package versions and peer ranges stay aligned across publishable wrappers.

### Toolchain and Upgrade Flow

- [x] **TOOL-01**: Maintainer can build and test the workspace on the latest supported Angular version.
- [x] **TOOL-02**: Maintainer can keep compatibility with multiple previous Angular versions through documented and validated peer/version policy.
- [x] **TOOL-03**: Maintainer can run a repeatable upgrade workflow that makes future dependency updates simpler and lower-risk.

### Initialization and Runtime Behavior

- [ ] **INIT-01**: Angular app developer can initialize tsParticles plugins through one app-level Angular provider initialization flow.
- [ ] **INIT-02**: Angular wrapper components can become operational only after the provider initialization flow completes.
- [ ] **INIT-03**: Angular app can execute plugin loading exactly once per app lifecycle, and any subsequent load attempts are blocked or safely ignored.

### Component Reactivity

- [ ] **REACT-01**: App developer can update component input properties (including `id`, `options`, and equivalent config inputs) and see the particle instance refresh correctly.
- [ ] **REACT-02**: App developer can update component properties without requiring manual destroy/recreate steps.

### Demo and Documentation Validation

- [ ] **DEMO-01**: App developer can run Angular and Ionic demos that validate the v4 initialization and rendering flow end-to-end.
- [ ] **DEMO-02**: Maintainer can use smoke/e2e checks to detect regressions in demo integration behavior before release.
- [ ] **DOCS-01**: App developer can follow updated migration and setup docs for v4 without relying on v3 instructions.

## v2 Requirements

Deferred to future releases.

### Ecosystem Enhancements

- **ENH-01**: App developer can switch initialization channels automatically between stable and prerelease trains.

## Out of Scope

| Feature                      | Reason                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Support for tsParticles v3   | Milestone is a major v4 transition; dual-major support increases complexity and slows modernization |
| Cross-framework wrapper work | This repository scope is Angular/Ionic only                                                         |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| DEPS-01     | Phase 1 | Complete |
| DEPS-02     | Phase 1 | Complete |
| DEPS-03     | Phase 1 | Complete |
| TOOL-01     | Phase 1 | Complete |
| TOOL-02     | Phase 1 | Complete |
| TOOL-03     | Phase 1 | Complete |
| INIT-01     | Phase 2 | Pending |
| INIT-02     | Phase 2 | Pending |
| INIT-03     | Phase 2 | Pending |
| REACT-01    | Phase 2 | Pending |
| REACT-02    | Phase 2 | Pending |
| DEMO-01     | Phase 3 | Pending |
| DEMO-02     | Phase 3 | Pending |
| DOCS-01     | Phase 3 | Pending |

**Coverage:**

- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---

_Requirements defined: 2026-04-10_
_Last updated: 2026-04-10 after roadmap creation for milestone v2.0_
