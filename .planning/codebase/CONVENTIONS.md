# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**

- Use Angular-standard feature suffixes in filenames: `*.component.ts`, `*.module.ts`, `*.routing.module.ts`, `*.page.ts`, `*.spec.ts` (examples: `apps/ionic-demo/src/app/tab1/tab1.page.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Use kebab-case file names for Angular units (examples: `ng-particles-engine.service.ts`, `explore-container.component.ts`).
- Use `public-api.ts` as barrel entry points for library exports (examples: `components/confetti/projects/ng-confetti/src/public-api.ts`, `components/fireworks/projects/ng-fireworks/src/public-api.ts`).

**Functions:**

- Use camelCase for methods and callbacks (examples: `particlesLoaded`, `getInstallationStatus`, `toggleParticlesClick` in `apps/angular-demo/src/app/app.component.ts` and `components/particles/projects/ng-particles/src/lib/ng-particles.service.ts`).
- Prefix Angular lifecycle hooks with `ng` (`ngOnInit`, `ngAfterViewInit`, `ngOnDestroy`) in component classes.

**Variables:**

- Use camelCase for instance fields and locals (examples: `particlesOptions`, `fireworksVisible`, `fireworks_instance` in `apps/angular-demo/src/app/app.component.ts`, `components/fireworks/projects/ng-fireworks/src/lib/ng-fireworks.component.ts`).
- Keep UI-bound properties as class fields rather than local state objects (examples in `apps/angular-demo/src/app/app.component.ts`, `apps/ionic-demo/src/app/tab1/tab1.page.ts`).

**Types:**

- Prefer explicit TypeScript type imports for library contracts (examples: `import type { Container, Engine, ISourceOptions }` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Use return types on public methods (`void`, `Promise<Engine>`, `Observable<boolean>`) in `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`.

## Code Style

**Formatting:**

- Tooling baseline is EditorConfig in each package: `apps/angular-demo/.editorconfig`, `apps/ionic-demo/.editorconfig`, `components/*/.editorconfig`.
- Enforce 2-space indentation, UTF-8, trailing newline, and trimmed trailing whitespace.
- Use single quotes for TypeScript where `.editorconfig` applies (`quote_type = single`).
- Prettier is used for repository/docs tasks from root scripts in `package.json` and package-level scripts in `components/*/package.json`.

**Linting:**

- ESLint is configured only for Ionic app in `apps/ionic-demo/.eslintrc.json`.
- Apply Angular selector conventions from ESLint rules:
  - Component selector: element + `app` prefix + kebab-case.
  - Directive selector: attribute + `app` prefix + camelCase.
  - Component class suffixes: `Page` or `Component`.
- Other workspace packages do not include local ESLint config files; follow Angular + strict TypeScript compiler settings from package `tsconfig.json` files.

## Import Organization

**Order:**

1. Angular framework imports (example: `@angular/core`, `@angular/common` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
2. Third-party dependencies (`@tsparticles/*`, `rxjs`) in the same file.
3. Local relative imports (`./ng-particles.service`, `../explore-container/explore-container.module`).

**Path Aliases:**

- Library packaging aliases are defined via `compilerOptions.paths` in:
  - `components/particles/tsconfig.json` (`ng-particles`)
  - `components/confetti/tsconfig.json` (`ng-confetti`)
  - `components/fireworks/tsconfig.json` (`ng-fireworks`)
- App code uses relative imports rather than custom aliases (`apps/angular-demo/src/app/*`, `apps/ionic-demo/src/app/*`).

## Error Handling

**Patterns:**

- Wrap async integration calls in `try/catch` and emit fallback states where applicable (example: `loadParticles()` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Convert unknown thrown values into `Error` objects before propagating (`err instanceof Error ? err : new Error(String(err))` in `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`).
- For bootstrap failures, chain `.catch(...)` from Angular bootstrap promise in app entry points (`apps/angular-demo/src/main.ts`, `apps/ionic-demo/src/main.ts`).

## Logging

**Framework:** console

**Patterns:**

- Use `console.error(...)` for failed engine/component initialization (`components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`, `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Demo apps use `console.log(...)` for lifecycle and click telemetry (`apps/angular-demo/src/app/app.component.ts`, `apps/ionic-demo/src/app/app.component.ts`).
- For new library code, prefer `console.error` in catch paths and avoid persistent `console.log` in production-facing library logic.

## Comments

**When to Comment:**

- Keep comments for setup intent and integration caveats (examples: `apps/*/src/test.ts`, inline notes in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Keep TODO markers explicit when a test gap exists (`apps/ionic-demo/src/app/app.component.spec.ts`).

**JSDoc/TSDoc:**

- Service-level API methods use short TSDoc blocks in shared library services (example: `components/particles/projects/ng-particles/src/lib/ng-particles-engine.service.ts`).
- Components generally rely on self-descriptive names and Angular decorators without full docblocks.

## Function Design

**Size:**

- Keep most Angular components small and focused; larger orchestration is isolated to service/component integration files (example of larger integration logic: `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).

**Parameters:**

- Use typed callback parameters for engine hooks (`particlesInit: (engine: Engine) => Promise<void> | void` in `components/particles/projects/ng-particles/src/lib/ng-particles.component.ts`).
- Use Angular `@Input()` for external configuration and keep defaults in constructor/field initializers (`components/confetti/projects/ng-confetti/src/lib/ng-confetti.component.ts`).

**Return Values:**

- Use explicit return types for lifecycle and public API methods (`void`, `Promise<Engine>`, `Observable<...>`).
- In async methods with side effects, return early for guard conditions (`isPlatformServer`, initialized checks).

## Module Design

**Exports:**

- Export Angular modules/components via `public-api.ts` in each library package:
  - `components/particles/projects/ng-particles/src/public-api.ts`
  - `components/confetti/projects/ng-confetti/src/public-api.ts`
  - `components/fireworks/projects/ng-fireworks/src/public-api.ts`

**Barrel Files:**

- Use `public-api.ts` as the only barrel contract for publishable libraries.
- Keep internals local to `src/lib/*` and only expose stable module/component symbols.

---

_Convention analysis: 2026-04-10_
