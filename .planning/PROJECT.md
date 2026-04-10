# tsParticles Angular Workspace

## What This Is

This project is the official Angular integration workspace for tsParticles, including reusable Angular libraries and demo applications. It enables Angular and Ionic developers to embed configurable particle effects through framework-native components, modules, and services. The workspace is designed to support both package consumers and maintainers shipping updates across multiple related packages.

## Core Value

Angular developers can add reliable, customizable tsParticles effects quickly using first-class Angular packages.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Consumers can install and use `@tsparticles/angular` with documented Angular patterns.
- [ ] Consumers can render particle effects via component options or remote JSON URL configuration.
- [ ] Maintainers can build and test apps/libraries consistently across the monorepo.
- [ ] The project can provide clear examples for both Angular and Ionic Angular usage.

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

---

_Last updated: 2026-04-10 after initialization_
