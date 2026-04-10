# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**

- Jasmine + Karma via Angular CLI builder
- Config: `apps/angular-demo/karma.conf.js`, `apps/ionic-demo/karma.conf.js`, `components/particles/projects/ng-particles/karma.conf.js`

**Assertion Library:**

- Jasmine (`expect(...).toBeTruthy()`, `toEqual`, `toContain`) in `apps/angular-demo/src/app/app.component.spec.ts` and `apps/ionic-demo/src/app/*.spec.ts`

**Run Commands:**

```bash
pnpm --filter @tsparticles/angular-demo test      # Run Angular demo unit tests
pnpm --filter @tsparticles/ionic-demo test        # Run Ionic demo unit tests
pnpm --filter @tsparticles/ionic-demo e2e         # Run Ionic Protractor E2E tests
```

## Test File Organization

**Location:**

- Co-located tests next to source files in app code under `apps/angular-demo/src/app/` and `apps/ionic-demo/src/app/`.
- No `*.spec.ts` files detected under library sources in `components/**/projects/**/src/lib/`.

**Naming:**

- `*.spec.ts` naming for unit tests (examples: `apps/ionic-demo/src/app/tab1/tab1.page.spec.ts`, `apps/angular-demo/src/app/app.component.spec.ts`).
- E2E spec naming uses `*.e2e-spec.ts` (`apps/ionic-demo/e2e/src/app.e2e-spec.ts`).

**Structure:**

```
apps/angular-demo/src/app/*.spec.ts
apps/ionic-demo/src/app/**/*.spec.ts
apps/ionic-demo/e2e/src/*.e2e-spec.ts
```

## Test Structure

**Suite Organization:**

```typescript
describe("Tab1Page", () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

Pattern from `apps/ionic-demo/src/app/tab1/tab1.page.spec.ts`.

**Patterns:**

- Setup pattern: configure Angular `TestBed` inside `beforeEach` and call `compileComponents()`.
- Teardown pattern: implicit teardown (no explicit `afterEach` cleanup in current specs).
- Assertion pattern: direct Jasmine expectations on component instance and rendered DOM (`apps/angular-demo/src/app/app.component.spec.ts`).

## Mocking

**Framework:** Jasmine/Angular TestBed (no dedicated mocking library detected)

**Patterns:**

```typescript
TestBed.configureTestingModule({
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
}).compileComponents();
```

Pattern from `apps/ionic-demo/src/app/app.component.spec.ts` and `apps/ionic-demo/src/app/tabs/tabs.page.spec.ts`.

**What to Mock:**

- Prefer Angular schema suppression for unknown/custom elements in Ionic shell component tests (`CUSTOM_ELEMENTS_SCHEMA`).
- Prefer importing real lightweight modules for dependent components in page tests (`ExploreContainerComponentModule` in tab tests).

**What NOT to Mock:**

- Do not add Jest/Vitest mock APIs (`jest.mock`, `vi.mock`) in this codebase; none are configured.
- Avoid introducing spies as primary strategy unless necessary; no spy patterns are currently established in `*.spec.ts`.

## Fixtures and Factories

**Test Data:**

```typescript
const fixture = TestBed.createComponent(AppComponent);
const app = fixture.componentInstance;
expect(app.title).toEqual("ng-particles-demo");
```

Pattern from `apps/angular-demo/src/app/app.component.spec.ts`.

**Location:**

- No shared fixture/factory directories detected.
- Test objects are created inline within each `*.spec.ts` file.

## Coverage

**Requirements:** None enforced at CI level

- CI workflow in `.github/workflows/nodejs.yml` runs formatting + build (`prettify:ci:readme`, `build:ci`) and does not run test targets.

**View Coverage:**

```bash
pnpm --filter @tsparticles/angular-demo test   # writes coverage to apps/angular-demo/coverage/ng-particles-demo
pnpm --filter @tsparticles/ionic-demo test     # writes coverage to apps/ionic-demo/coverage/ngv
```

Coverage output paths configured in respective `karma.conf.js` files.

## Test Types

**Unit Tests:**

- Angular component unit tests via Karma/Jasmine in both demo apps (`apps/angular-demo/src/app/*.spec.ts`, `apps/ionic-demo/src/app/**/*.spec.ts`).

**Integration Tests:**

- Lightweight module-integration style tests via `TestBed` with module imports (for example tabs importing `ExploreContainerComponentModule` in `apps/ionic-demo/src/app/tab*/tab*.page.spec.ts`).

**E2E Tests:**

- Protractor + Jasmine configured for Ionic app in `apps/ionic-demo/e2e/protractor.conf.js`.
- Single E2E spec currently present: `apps/ionic-demo/e2e/src/app.e2e-spec.ts`.

## Common Patterns

**Async Testing:**

```typescript
beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({ ... }).compileComponents();
}));
```

Pattern from `apps/ionic-demo/src/app/explore-container/explore-container.component.spec.ts` and tab specs.

**Error Testing:**

```typescript
// Not detected in current specs.
// Existing tests validate creation/rendering only.
```

No explicit error-path assertions detected in `apps/angular-demo/src/app/app.component.spec.ts` or `apps/ionic-demo/src/app/**/*.spec.ts`.

---

_Testing analysis: 2026-04-10_
