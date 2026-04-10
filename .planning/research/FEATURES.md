# Feature Research

**Domain:** Angular monorepo modernization + tsParticles v4 beta migration (existing Angular/Ionic wrapper workspace)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist for an upgrade milestone. Missing these = modernization effort is not trustworthy.

| Feature                                                     | Why Expected                                                                                                    | Complexity | Notes                                                                                                  |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Monorepo-assisted upgrade flow (`nx migrate` + `ng update`) | Modern Angular/Nx workspaces are expected to use official migrations, not manual random edits                   | MEDIUM     | Expected behavior: generate migration plan, review, run, then verify build/test for each package/demo  |
| Pre-release dependency lane for tsParticles `4.0.0-beta`    | Milestone explicitly targets beta integration; maintainers need deterministic pre-release installation behavior | MEDIUM     | Use explicit beta versions and workspace-level control (pin/override), not floating ranges             |
| Version-compatibility matrix in docs                        | Consumers expect clear “works with Angular X / Ionic Y / Node Z” boundaries                                     | LOW        | Must include Angular/Ionic minimums and Node/TypeScript constraints from official compatibility tables |
| Monorepo-wide consistency checks                            | In multi-package repos, users expect all related packages to align (peer deps, build configs, APF outputs)      | MEDIUM     | Includes check for `@angular/*`, `@ionic/*`, tsParticles packages, and Nx plugin version sync          |
| Migration guide for existing consumers                      | Upgrades are expected to include “what changed + exact steps”                                                   | MEDIUM     | Document breaking/behavioral changes, required peer updates, and before/after snippets                 |
| CI gate updates for upgraded toolchain                      | Modernization without CI enforcement regresses quickly                                                          | MEDIUM     | Expected: lint/build/test across packages + demo smoke tests on supported Node versions                |

### Differentiators (Competitive Advantage)

Features that make this upgrade notably better than a typical “bump versions and hope” migration.

| Feature                                                                 | Value Proposition                                                                           | Complexity | Notes                                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| Dry-run modernization command bundle (`upgrade:plan` / `upgrade:apply`) | Gives maintainers repeatable, auditable upgrade workflow instead of ad-hoc shell history    | MEDIUM     | Wrap official tools; output migration summary and unresolved manual tasks                        |
| Beta adoption guardrails (single switch for stable↔beta channels)       | Makes pre-release testing safer and rollback-friendly for maintainers and contributors      | MEDIUM     | Scope: dependency channel control only; no runtime feature flags                                 |
| Compatibility test matrix (Angular app + Ionic app demos)               | Proves real-world integration behavior, not only library unit tests                         | HIGH       | Run demo install/build/serve test paths to catch peer/tooling drift early                        |
| “Upgrade contract” documentation                                        | Reduces maintainer bus factor by codifying supported paths, non-goals, and release criteria | LOW        | Should include clear boundaries: what this milestone upgrades and what it intentionally does not |

### Anti-Features (Commonly Requested, Often Problematic)

Features that appear attractive but are out-of-scope or harmful for this milestone.

| Feature                                                                 | Why Requested                                              | Why Problematic                                                               | Alternative                                                                               |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Auto-fix every consumer app externally                                  | Users want one-click migration for all downstream projects | Impossible to guarantee across unknown app architectures; high support burden | Provide precise migration guide + compatibility matrix + known-issues section             |
| Broad API redesign during tooling upgrade                               | “If we’re touching everything, let’s redesign APIs too”    | Blends modernization with product redesign, increases regression risk         | Keep API surface mostly stable; isolate true breaking changes and document them           |
| Cross-framework unification work (React/Vue wrappers) in same milestone | Desire for ecosystem parity                                | Conflicts with explicit Angular/Ionic scope and delays deliverable            | Keep this milestone Angular/Ionic only; track cross-framework work separately             |
| Permanent support for both old and new toolchains in same codepath      | Users fear upgrade friction                                | Dual-path maintenance multiplies complexity and blocks forward progress       | Define minimum supported versions and provide migration path, not indefinite dual support |

## Feature Dependencies

```
[Existing Angular/Ionic packages + demo apps]
    └──requires──> [Toolchain migration execution]
                      └──requires──> [Official migrations: nx migrate + ng update]

[tsParticles 4.0.0-beta dependency lane]
    └──requires──> [Workspace dependency pin/override strategy]
                      └──requires──> [Monorepo consistency checks]

[Consumer migration guide]
    └──requires──> [Validated upgrade run on demos]

[Compatibility matrix docs]
    └──requires──> [CI matrix + verified version constraints]

[Large API redesign]
    └──conflicts──> [Low-risk modernization objective]
```

### Dependency Notes

- **Toolchain migration depends on existing package topology:** this milestone modernizes the current monorepo; it does not replace repo structure.
- **Beta dependency migration depends on workspace-level version control:** pre-release packages must be pinned and consistently resolved across all Angular/Ionic packages.
- **Migration guide depends on validated demos:** docs must reflect proven steps from real Angular and Ionic demo upgrades.
- **Compatibility matrix depends on CI evidence:** support statements should be backed by automated checks, not assumptions.
- **API redesign conflicts with modernization scope:** introducing broad behavioral changes reduces upgrade reliability.

## MVP Definition

### Launch With (v1)

Minimum viable modernization for this milestone.

- [ ] Official migration-based upgrade path implemented and documented (`nx migrate`/`ng update` driven)
- [ ] tsParticles `4.0.0-beta` integrated consistently in targeted packages
- [ ] Updated compatibility matrix (Angular/Ionic/Node/TypeScript) published
- [ ] Migration guide for existing consumers with explicit breaking-change notes
- [ ] CI validates monorepo packages and Angular+Ionic demos on supported environments

### Add After Validation (v1.x)

Post-launch hardening and DX improvements.

- [ ] Wrapper scripts for repeatable upgrade planning/application
- [ ] Automated upgrade report artifact (what changed, what was manual)
- [ ] Additional demo scenarios for edge integrations (SSR/hybrid routing combinations)

### Future Consideration (v2+)

Useful, but not necessary for this modernization milestone.

- [ ] Consumer-side codemod tooling for app-level migrations
- [ ] Cross-repo orchestration with other framework wrappers

## Feature Prioritization Matrix

| Feature                                      | User Value | Implementation Cost | Priority |
| -------------------------------------------- | ---------- | ------------------- | -------- |
| Official migration execution workflow        | HIGH       | MEDIUM              | P1       |
| tsParticles beta dependency lane             | HIGH       | MEDIUM              | P1       |
| Compatibility matrix + scope boundaries docs | HIGH       | LOW                 | P1       |
| Consumer migration guide                     | HIGH       | MEDIUM              | P1       |
| CI matrix for Angular/Ionic demos            | HIGH       | HIGH                | P1       |
| Upgrade wrapper scripts                      | MEDIUM     | MEDIUM              | P2       |
| Automated upgrade report                     | MEDIUM     | MEDIUM              | P2       |
| Consumer codemods                            | MEDIUM     | HIGH                | P3       |

**Priority key:**

- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature                      | Typical Angular library repos | High-discipline monorepos              | Our Approach                                                    |
| ---------------------------- | ----------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Dependency updates           | Manual version bumps          | Official migration tools + review      | Use official migration-first flow with explicit review gates    |
| Pre-release package handling | Ad-hoc installs               | Pinned channels and controlled rollout | Pin `4.0.0-beta` lane and validate across all relevant packages |
| Upgrade docs                 | Changelog-only                | Migration guide + compatibility table  | Publish actionable migration contract (steps + boundaries)      |
| Validation surface           | Library tests only            | Workspace + sample app validation      | Validate both package builds and Angular/Ionic demos            |

## Sources

- Project scope: `/Users/matteo/Projects/GitHub/tsparticles/angular/.planning/PROJECT.md` (HIGH)
- Angular CLI update command: https://angular.dev/cli/update (HIGH)
- Angular update guide: https://angular.dev/update-guide (HIGH)
- Angular version compatibility matrix: https://angular.dev/reference/versions (HIGH)
- Angular library/APF guidance:
  - https://angular.dev/tools/libraries/creating-libraries (HIGH)
  - https://angular.dev/tools/libraries/angular-package-format (HIGH)
- Nx migration workflow: https://nx.dev/docs/features/automate-updating-dependencies (HIGH)
- pnpm workspace + overrides/settings:
  - https://pnpm.io/workspaces (HIGH)
  - https://pnpm.io/settings#overrides (HIGH)
- Ionic Angular support/tooling: https://ionicframework.com/docs/angular/overview (HIGH)
- Lerna version/publish behavior (for monorepo release boundary context): https://lerna.js.org/docs/features/version-and-publish (MEDIUM)

---

_Feature research for: Angular monorepo modernization + tsParticles v4 beta migration_
_Researched: 2026-04-10_
