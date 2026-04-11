# Phase 1: Dependency & Toolchain Alignment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10T16:26:43Z
**Phase:** 01-dependency-toolchain-alignment
**Areas discussed:** tsParticles dependency policy, Angular peer compatibility policy, CI enforcement strategy, upgrade workflow contract

---

## tsParticles dependency policy

| Option             | Description                                                                           | Selected |
| ------------------ | ------------------------------------------------------------------------------------- | -------- |
| Strict single line | Pin all tsParticles packages to `4.0.0-beta.11` consistently across apps and wrappers | ✓        |
| Mixed tolerant     | Allow mixed prerelease specifiers (`^beta` and exact) if installs still resolve       |          |
| Relaxed            | Allow package-by-package exceptions during migration                                  |          |

**User's choice:** Strict single line (auto-selected recommended default)
**Notes:** Auto mode prioritized deterministic dependency alignment and removal of mixed version drift risk.

---

## Angular peer compatibility policy

| Option                         | Description                                                                             | Selected |
| ------------------------------ | --------------------------------------------------------------------------------------- | -------- |
| Unified documented peer matrix | Define one cross-wrapper peer policy and validate it against supported Angular versions | ✓        |
| Leave current ranges           | Keep existing heterogeneous peer ranges and document ad hoc caveats                     |          |
| Future-only baseline           | Target only latest Angular and remove explicit backward-compat policy                   |          |

**User's choice:** Unified documented peer matrix (auto-selected recommended default)
**Notes:** Keeps TOOL-02 enforceable while preserving modernization goals.

---

## CI enforcement strategy

| Option                             | Description                                                          | Selected |
| ---------------------------------- | -------------------------------------------------------------------- | -------- |
| Fail-fast policy gate before build | Add explicit dependency/peer alignment check ahead of `build:ci`     | ✓        |
| Build-only enforcement             | Rely on existing build failures to catch dependency drift indirectly |          |
| Release-time manual review         | Check alignment only before version/release steps                    |          |

**User's choice:** Fail-fast policy gate before build (auto-selected recommended default)
**Notes:** Reduces feedback loop time and gives maintainers actionable policy errors early.

---

## Upgrade workflow contract

| Option                                                | Description                                                       | Selected |
| ----------------------------------------------------- | ----------------------------------------------------------------- | -------- |
| Documented repeatable flow with verification evidence | Define maintainable upgrade steps and required validation outputs | ✓        |
| Implicit maintainer knowledge                         | Keep workflow tribal; no explicit checklist                       |          |
| Tooling-only automation                               | Automate upgrades without preserving human-readable process docs  |          |

**User's choice:** Documented repeatable flow with verification evidence (auto-selected recommended default)
**Notes:** Supports TOOL-03 and lowers future upgrade risk.

---

## the agent's Discretion

- Implementation details of dependency-policy checker (script/tool choice).
- Exact compatibility matrix breadth for non-blocking checks.
- Documentation location as long as discoverable by maintainers.

## Deferred Ideas

None.
