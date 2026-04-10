# Pitfalls Research

**Domain:** Angular multi-package workspace modernization + tsParticles v4 beta migration
**Researched:** 2026-04-10
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: SemVer prerelease ranges that look right but resolve wrong

**What goes wrong:**
You think all packages are on `4.0.0-beta`, but installs resolve different combinations (or fail), because prerelease matching behaves differently than normal stable ranges.

**Why it happens:**
SemVer excludes prereleases from broad ranges unless prerelease is explicitly opted in for that tuple. Mixed specs like exact (`4.0.0-beta.11`), caret prerelease (`^4.0.0-beta.11`), and broad stable ranges create non-obvious resolution behavior.

**How to avoid:**

- Pick one workspace-wide prerelease policy for tsParticles beta dependencies (recommended: exact beta pins during migration).
- Enforce it with a workspace lint/check script that rejects mixed range styles for `@tsparticles/*`.
- Publish only after lockfile + packed tarball verification proves one resolved beta line.

**Warning signs:**

- `pnpm install` succeeds locally but consumers report peer conflicts.
- Different packages in workspace reference different beta range styles.
- Frequent "works with beta.N but not beta.N+1" issues.

**Phase to address:**
Phase 0 — Dependency contract and semver policy

---

### Pitfall 2: Inconsistent peerDependencies across sibling packages

**What goes wrong:**
One package advertises modern Angular support while another sibling package still declares ultra-broad legacy peers, causing contradictory install signals in the same ecosystem.

**Why it happens:**
Maintainers update one package first and forget sibling metadata. In this repo today, Angular peer ranges differ across package folders (e.g., strict `^17 || ^18 || ^19` vs `>=2.0.0` patterns), and tsParticles peer declarations are not aligned across wrappers.

**How to avoid:**

- Define a single source-of-truth peer matrix (`Angular`, `RxJS`, `@tsparticles/*`) and generate package peer blocks from it.
- Fail CI if sibling package peers drift.
- Keep peer ranges broad only where tested; never broader than CI matrix coverage.

**Warning signs:**

- Same repo packages show different Angular support claims.
- npm/pnpm peer warnings differ depending on which wrapper is installed.
- Docs claim "broad compatibility" but package metadata disagrees.

**Phase to address:**
Phase 0 — Workspace metadata normalization

---

### Pitfall 3: Upgrading Angular/tooling without aligned Node+TypeScript baseline

**What goes wrong:**
Workspace upgrades compile in one package but fail in another, or CI fails only on certain jobs, due to Angular major compatibility requirements not being enforced monorepo-wide.

**Why it happens:**
Angular has strict version compatibility with Node and TypeScript. In multi-package workspaces, drift appears when app and library projects inherit different TS configs or tool versions over time.

**How to avoid:**

- Freeze a target baseline (Angular major + Node + TypeScript + RxJS) from the official compatibility table before code changes.
- Upgrade toolchain first, then libs/apps in dependency order.
- Add a preflight CI job that fails fast on incompatible Node/TS versions.

**Warning signs:**

- "TypeScript version not supported" or builder/compiler mismatch errors.
- One app builds while another fails with the same commit.
- Frequent lockfile churn around TS/compiler packages.

**Phase to address:**
Phase 1 — Toolchain baseline upgrade

---

### Pitfall 4: Shipping modernization changes without `ng update` migration path

**What goes wrong:**
Breaking API/config modernization lands, but consumers have no automated migration path, turning upgrade into manual break/fix and high support burden.

**Why it happens:**
Teams treat modernization as internal refactor. Angular library guidance explicitly supports update schematics for breaking changes, but they are often skipped in wrapper libraries.

**How to avoid:**

- Define consumer-facing breaking changes early.
- Add/update schematics for key migration steps (`ng add`/`ng update` path where applicable).
- Ship migration docs and runnable before/after examples in demo apps.

**Warning signs:**

- Release notes contain long "manual steps" sections.
- Repeated issues asking how to move from old init/config patterns.
- Consumers pin old major due to migration effort.

**Phase to address:**
Phase 3 — Migration tooling and docs

---

### Pitfall 5: APF/package entrypoint regressions during packaging modernization

**What goes wrong:**
Packages build locally but fail in consumer apps due to broken exports, deep-import reliance, or non-APF compliant output expectations.

**Why it happens:**
Library modernization touches package metadata (`exports`, entrypoints, side effects, TS target). In monorepos, local path linking can hide issues that only appear after publish.

**How to avoid:**

- Keep APF-compliant packaging (`partial` compilation already present) and validate packed tarballs in a clean external consumer test.
- Disallow deep imports in docs and tests.
- Verify each package’s primary and secondary entrypoints post-pack.

**Warning signs:**

- Consumers import internal file paths to make things work.
- Published package works in workspace demos but not in fresh external app.
- Build errors around unresolved entrypoints or missing type exports.

**Phase to address:**
Phase 2 — Packaging/APF hardening

---

### Pitfall 6: Monorepo release atomics broken (partial version bumps)

**What goes wrong:**
Only some packages are released/retagged for the beta migration, producing incompatible cross-package combinations in npm.

**Why it happens:**
Nx/Lerna/pnpm workspaces make partial publish easy if release orchestration isn’t strict. Broad-version modernization amplifies this because consumers mix wrappers (`angular`, `confetti`, `fireworks`) together.

**How to avoid:**

- Treat related wrappers as a release set for beta line changes.
- Add CI checks that verify all sibling package versions/peer policies before publish.
- Run a smoke-install matrix from npm tarballs (not workspace links) before release.

**Warning signs:**

- npm shows new version for one wrapper but not siblings.
- Consumer installs require manual override/resolution hacks.
- Release rollback/hotfixes immediately after publish.

**Phase to address:**
Phase 4 — Release orchestration and verification

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut                                               | Immediate Benefit            | Long-term Cost                                                  | When Acceptable                                                  |
| ------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| Keep legacy peer ranges like `>=2` to avoid complaints | Fewer short-term peer errors | False compatibility claims, runtime breakage on untested majors | Never for published compatibility promises                       |
| Mix exact and caret beta specs in sibling packages     | Faster local unblock         | Unpredictable prerelease resolution across consumers            | Never                                                            |
| Validate only workspace-linked installs                | Fast CI                      | Publish-time breakage undetected                                | Only in early dev; must be followed by packed-tarball smoke test |

## Integration Gotchas

Common mistakes when connecting modernization into the workspace toolchain.

| Integration                   | Common Mistake                                                | Correct Approach                                                                                  |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| pnpm workspace linking        | Assuming workspace link behavior equals real consumer install | Test with packed artifacts in clean external app in addition to workspace builds                  |
| Angular library publishing    | Putting Angular core deps in `dependencies` instead of peers  | Keep `@angular/*` in `peerDependencies` per Angular guidance                                      |
| Angular modernization rollout | Refactor APIs without update schematics/migrations            | Provide `ng update` migration support for breaking releases                                       |
| Lerna/Nx release flow         | Publishing subset of related wrappers                         | Enforce release-set atomicity for `@tsparticles/angular`, `angular-confetti`, `angular-fireworks` |

## Performance Traps

Modernization/pipeline traps that break at scale in CI/release.

| Trap                                            | Symptoms                               | Prevention                                                                 | When It Breaks                        |
| ----------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| Rebuilding all packages for every small change  | Slow PR cycles, flaky CI timeouts      | Use affected/build graph strategy + phased upgrade sequencing              | As package count and matrix size grow |
| Running full matrix too late (only pre-release) | Last-minute blocker discoveries        | Run minimal compatibility matrix on every PR, full matrix on merge/release | During beta cadence                   |
| Skipping deterministic lockfile checks          | "Works on my machine" dependency drift | Enforce lockfile consistency and clean-install CI jobs                     | Cross-platform contributor teams      |

## Security Mistakes

Supply-chain and release integrity mistakes specific to beta modernization.

| Mistake                                              | Risk                                                    | Prevention                                                |
| ---------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Pulling beta dependencies with broad floating ranges | Accidental intake of unvalidated prerelease builds      | Pin beta versions during migration and bump intentionally |
| Publishing without artifact verification             | Broken/maliciously altered package contents reach users | Verify packed tarball contents and checks before publish  |
| Treating peer warnings as non-actionable noise       | Hidden incompatible dependency trees                    | Fail CI on new peer warning classes for release branches  |

## UX Pitfalls

Developer-experience pitfalls for consumers upgrading.

| Pitfall                                             | User Impact                                 | Better Approach                                                            |
| --------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| Inconsistent support messaging across packages/docs | Users cannot pick safe versions             | Publish one compatibility matrix and reference it from all package READMEs |
| "Modern API" docs without legacy-to-modern mapping  | Upgrade friction and support tickets        | Include old→new mapping table and migration examples                       |
| Hidden beta caveats                                 | Production incidents from unstable features | Mark beta behavior explicitly and define support expectations              |

## "Looks Done But Isn't" Checklist

- [ ] **Semver policy:** one documented beta range policy across all `@tsparticles/*` deps
- [ ] **Peer alignment:** sibling wrappers expose the same tested Angular/RxJS compatibility rules
- [ ] **Toolchain baseline:** Node/TypeScript versions validated against Angular compatibility table
- [ ] **Migration support:** breaking modernizations covered by update guidance/schematics
- [ ] **Packaging verification:** packed artifacts tested in clean external Angular + Ionic apps
- [ ] **Atomic release:** all related wrappers released and validated together

## Recovery Strategies

| Pitfall                               | Recovery Cost | Recovery Steps                                                                                       |
| ------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| Prerelease semver mismatch            | MEDIUM        | Normalize all beta ranges, republish patched metadata, communicate exact compatible set              |
| Peer dependency drift across wrappers | HIGH          | Patch peer ranges in all siblings, backfill compatibility matrix, publish synchronized patch release |
| Toolchain baseline mismatch           | MEDIUM        | Freeze supported baseline, align lockfile + CI images, rerun full matrix                             |
| Missing migration path                | HIGH          | Publish migration guide + codemods/schematics in follow-up release, keep backward shim temporarily   |
| Non-atomic release set                | HIGH          | Issue coordinated hotfix release across all wrappers and deprecate broken versions                   |

## Pitfall-to-Phase Mapping

| Pitfall                              | Prevention Phase                 | Verification                                                            |
| ------------------------------------ | -------------------------------- | ----------------------------------------------------------------------- |
| SemVer prerelease range mismatch     | Phase 0 (Dependency contract)    | CI rule passes: no mixed beta range styles for `@tsparticles/*`         |
| Sibling peerDependencies drift       | Phase 0 (Metadata normalization) | Generated peer blocks identical where intended; drift check green       |
| Angular/Node/TS baseline mismatch    | Phase 1 (Toolchain baseline)     | Preflight job validates versions against Angular compatibility          |
| APF/entrypoint regressions           | Phase 2 (Packaging hardening)    | Fresh external app install from tarball builds successfully             |
| Missing `ng update` migration path   | Phase 3 (Migration tooling/docs) | Upgrade test from prior stable version succeeds with documented steps   |
| Partial/non-atomic workspace release | Phase 4 (Release orchestration)  | Release checklist proves all wrappers published + smoke-tested together |

## Sources

- Angular version compatibility (Node/TypeScript/RxJS): https://angular.dev/reference/versions _(HIGH)_
- Angular migrations overview + update workflow: https://angular.dev/reference/migrations and https://angular.dev/update-guide _(HIGH)_
- Angular library guidance (peer dependencies, schematics, packaging, compatibility): https://angular.dev/tools/libraries/creating-libraries _(HIGH)_
- Angular Package Format (APF, partial compilation, entrypoints): https://angular.dev/tools/libraries/angular-package-format _(HIGH)_
- pnpm workspace protocol and workspace linking behavior: https://pnpm.io/workspaces _(HIGH)_
- npm/node-semver prerelease range behavior: https://github.com/npm/node-semver#prerelease-tags _(MEDIUM — authoritative implementation docs, but GitHub-rendered source doc)_
- Local workspace evidence for current drift risk: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, and component package manifests under `components/*/projects/*/package.json` _(HIGH for repo-observed facts)_

---

_Pitfalls research for: tsParticles Angular v4 beta modernization milestone_
_Researched: 2026-04-10_
