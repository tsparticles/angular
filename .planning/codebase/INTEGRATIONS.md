# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**UI/Animation SDKs:**

- tsParticles packages (`@tsparticles/*`, `tsparticles`) - In-process particle/confetti/fireworks rendering, not remote API calls.
  - SDK/Client: `@tsparticles/engine`, `@tsparticles/angular`, `@tsparticles/confetti`, `@tsparticles/fireworks`, `tsparticles` in `apps/angular-demo/package.json`, `apps/ionic-demo/package.json`, `components/*/package.json`.
  - Auth: Not applicable.

**Mobile Platform Runtime:**

- Capacitor runtime services - Native bridge for Ionic demo app shell.
  - SDK/Client: `@capacitor/core`, `@capacitor/app`, `@capacitor/haptics`, `@capacitor/keyboard`, `@capacitor/status-bar` in `apps/ionic-demo/package.json`.
  - Auth: Not applicable.

**Developer Platform Integrations:**

- GitHub Actions CI - Hosted CI execution for build/validation in `.github/workflows/nodejs.yml`.
  - SDK/Client: GitHub Actions workflow actions (`actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `actions/cache`).
  - Auth: GitHub-provided workflow token; optional commented secret `NX_CLOUD_ACCESS_TOKEN` in `.github/workflows/nodejs.yml`.

## Data Storage

**Databases:**

- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**

- Local filesystem only (build artifacts and static assets).
  - Examples: `apps/angular-demo/src/assets/`, `apps/ionic-demo/src/assets/`, packaged outputs under `components/*/dist/` (configured in component package exports and publishConfig).

**Caching:**

- CI dependency cache via GitHub Actions cache for pnpm store in `.github/workflows/nodejs.yml`.

## Authentication & Identity

**Auth Provider:**

- None detected for application runtime.
  - Implementation: Not applicable.

## Monitoring & Observability

**Error Tracking:**

- Not detected (no Sentry/Bugsnag/Rollbar integration in source and package manifests).

**Logs:**

- Local console logging in demo components/services (for lifecycle/debug output) in `apps/angular-demo/src/app/app.component.ts`.
- GitHub Actions job logs for CI in `.github/workflows/nodejs.yml`.

## CI/CD & Deployment

**Hosting:**

- Not explicitly configured in repository for app hosting; outputs are standard Angular/Ionic web bundles (`dist/ng-particles-demo` and `www`) per `apps/angular-demo/angular.json` and `apps/ionic-demo/angular.json`.

**CI Pipeline:**

- GitHub Actions workflow in `.github/workflows/nodejs.yml` running install, formatting check, and CI build commands from root `package.json`.

## Environment Configuration

**Required env vars:**

- None required for runtime app features detected in source.
- Optional CI variable reference: `NX_CLOUD_ACCESS_TOKEN` is present but commented in `.github/workflows/nodejs.yml`.

**Secrets location:**

- GitHub Actions repository/encrypted secrets for CI-only variables (implied by `${{ secrets.* }}` usage in `.github/workflows/nodejs.yml`).
- No `.env` files detected in repository (`**/.env*` search).

## Webhooks & Callbacks

**Incoming:**

- None detected (no webhook endpoints or backend HTTP handlers in repository).

**Outgoing:**

- None detected for application runtime HTTP integrations.
- CI sends workflow status/events through GitHub Actions platform integration configured in `.github/workflows/nodejs.yml`.

---

_Integration audit: 2026-04-10_
