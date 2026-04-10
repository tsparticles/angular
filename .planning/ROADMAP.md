# Roadmap: tsParticles Angular Workspace

## Overview

This roadmap delivers milestone v2.0 by first stabilizing dependency/toolchain contracts, then modernizing runtime initialization/reactivity behavior in the Angular wrappers, and finally proving the release with demos and migration documentation.

## Phases

- [ ] **Phase 1: Dependency & Toolchain Alignment** - Enforce one dependency policy and a repeatable modern upgrade baseline.
- [ ] **Phase 2: Initialization & Reactive Runtime** - Deliver a stable v4 provider-first runtime flow with reactive component behavior.
- [ ] **Phase 3: Demo Validation & Migration Docs** - Validate Angular/Ionic integrations and publish clear v4 migration guidance.

## Phase Details

### Phase 1: Dependency & Toolchain Alignment

**Goal**: Maintainers can upgrade and operate the workspace on a modern Angular baseline with enforceable dependency/peer consistency.
**Depends on**: Nothing (first phase)
**Requirements**: DEPS-01, DEPS-02, DEPS-03, TOOL-01, TOOL-02, TOOL-03
**Success Criteria** (what must be TRUE):

1. Maintainer can use a single tsParticles `4.0.0-beta` policy across all Angular/Ionic publishable packages.
2. CI detects and blocks mixed tsParticles major versions, peer-range drift, or wrapper version misalignment before release.
3. Maintainer can build and test the workspace successfully on the latest supported Angular version.
4. Maintainer can follow a documented, repeatable upgrade flow that preserves validated compatibility policy for supported previous Angular versions.
   **Plans**: TBD

### Phase 2: Initialization & Reactive Runtime

**Goal**: Angular developers can initialize tsParticles once at app level and use wrapper components that refresh correctly on config changes.
**Depends on**: Phase 1
**Requirements**: INIT-01, INIT-02, INIT-03, REACT-01, REACT-02
**Success Criteria** (what must be TRUE):

1. Angular app developer can initialize plugins through one app-level provider flow and then render working particle wrappers.
2. Wrapper components become operational only after provider initialization completes.
3. Plugin loading executes once per app lifecycle, and repeated load attempts are safely ignored.
4. App developer can update wrapper inputs (including id/options-equivalent config) and see instances refresh without manual destroy/recreate steps.
   **Plans**: TBD
   **UI hint**: yes

### Phase 3: Demo Validation & Migration Docs

**Goal**: Developers and maintainers can verify the v4 integration end-to-end in demos and upgrade using current documentation.
**Depends on**: Phase 2
**Requirements**: DEMO-01, DEMO-02, DOCS-01
**Success Criteria** (what must be TRUE):

1. App developer can run Angular and Ionic demos that demonstrate v4 initialization and rendering end-to-end.
2. Maintainer can run smoke/e2e demo checks that catch integration regressions before release.
3. App developer can complete v4 setup/migration by following updated docs without relying on legacy v3 instructions.
   **Plans**: TBD
   **UI hint**: yes

## Progress

| Phase                                | Plans Complete | Status      | Completed |
| ------------------------------------ | -------------- | ----------- | --------- |
| 1. Dependency & Toolchain Alignment  | 0/TBD          | Not started | -         |
| 2. Initialization & Reactive Runtime | 0/TBD          | Not started | -         |
| 3. Demo Validation & Migration Docs  | 0/TBD          | Not started | -         |
