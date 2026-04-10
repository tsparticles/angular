# tsParticles Angular Workspace

## What This Is

This project is the official Angular integration workspace for tsParticles, including reusable Angular libraries and demo applications. It enables Angular and Ionic developers to embed configurable particle effects through framework-native components, modules, and services. The workspace is designed to support both package consumers and maintainers shipping updates across multiple related packages.

## Core Value

Angular developers can add reliable, customizable tsParticles effects quickly using first-class Angular packages.

## Current Milestone: v2.0 Modernizzazione e upgrade v4 beta

**Goal:** aggiornare workspace e pacchetti Angular/Ionic alle versioni più recenti, integrando tsParticles 4.0.0-beta e migrando a pattern moderni mantenendo ampia compatibilita'.

**Target features:**

- Upgrade dipendenze principali del workspace (Angular/tooling/build chain) senza regressioni bloccanti.
- Integrazione completa dei pacchetti tsParticles 4.0.0-beta nei package interessati.
- Refactor verso sintassi moderne (API Angular, TypeScript, packaging, tooling).
- Aggiornamento documentazione, esempi e guida di migrazione.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Workspace dependencies are aligned to current stable ecosystem versions with no blocker regressions.
- [ ] tsParticles package integrations use `4.0.0-beta` consistently across Angular/Ionic packages.
- [ ] Codebase syntax is modernized across Angular APIs, TypeScript patterns, and packaging configuration.
- [ ] Documentation and demos are updated to reflect the upgraded stack and migration path.

### Out of Scope

- Non-Angular framework wrappers (React/Vue/Svelte) — maintained in separate ecosystem repositories.
- A visual no-code particle editor inside this package — not required for the core Angular wrapper mission.

## Context

This repository contains multiple packages and demo apps under a pnpm workspace with Nx/Lerna orchestration. README usage examples define the primary developer experience: install package, configure via options or URL, initialize engine modules, and react to load callbacks. Existing structure indicates a package-centric workflow where component libraries are built for npm consumption while demos validate integration behavior.

## Constraints

- **Tech stack**: Angular + TypeScript + tsParticles ecosystem — compatibility with Angular package conventions is mandatory.
- **Compatibility**: Must remain usable in both standard Angular apps and Ionic Angular apps — examples and APIs should not be platform-fragile.
- **Build tooling**: Monorepo scripts (`pnpm`, Nx, Lerna, Angular CLI, ng-packagr) — changes should preserve CI/release workflow consistency.

## Key Decisions

| Decision                                                      | Rationale                                                                | Outcome   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ | --------- |
| Use auto initialization from existing README and codebase map | Auto mode requires a source document and fast end-to-end setup           | - Pending |
| Keep research enabled before roadmap generation               | Even established domains benefit from explicit ecosystem/pitfall framing | - Pending |
| Use quick planning depth with parallel execution              | Preference is fast delivery with short phase decomposition               | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-04-10 after milestone v2.0 initialization_
