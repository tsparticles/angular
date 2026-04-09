# Angular Centralized Engine Pattern

## Overview

The `NgParticlesEngineService` is a singleton service that initializes the tsParticles engine **once per application** using Angular's built-in dependency injection. All `NgxParticlesComponent` instances automatically share this engine, reducing initialization overhead and improving performance.

### Benefits
- **Single initialization**: Engine and all plugins loaded once
- **Lazy loading**: Init happens when first needed
- **DI integration**: Fits naturally into Angular architecture
- **Backward compatible**: Components still work with old pattern
- **Type-safe**: Full TypeScript support

## Setup

### 1. Initialize Engine at App Bootstrap

Add initialization to your app component or in `main.ts`:

```typescript
import { Component, NgZone } from "@angular/core";
import { NgParticlesEngineService } from "@tsparticles/angular";
import { loadFull } from "@tsparticles/presets";

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent {
  constructor(
    private engineService: NgParticlesEngineService,
    private ngZone: NgZone,
  ) {
    this.initializeParticles();
  }

  private async initializeParticles(): Promise<void> {
    try {
      await this.engineService.init(async (engine) => {
        // Load all presets/plugins you need
        await loadFull(engine);
      });

      console.log("Particles engine initialized");
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  }
}
```

### 2. Use Components Without Extra Init

Once initialized, components automatically use the shared engine:

```typescript
import { Component } from "@angular/core";
import { NgxParticlesComponent } from "@tsparticles/angular";
import type { IParticlesProps } from "@tsparticles/angular";

@Component({
  selector: "app-particles-section",
  standalone: true,
  imports: [NgxParticlesComponent],
  template: `
    <ngx-particles
      [options]="particlesOptions"
      (particlesLoaded)="onParticlesLoaded($event)"
    ></ngx-particles>
  `,
})
export class ParticlesSectionComponent {
  particlesOptions: IParticlesProps["options"] = {
    // Configuration...
  };

  onParticlesLoaded(container: Container): void {
    console.log("Particles ready:", container);
  }
}
```

## Monitoring Initialization

### Check Engine Status

```typescript
export class MyComponent {
  isEngineReady$ = this.engineService.getInstallationStatus();
  initError$ = this.engineService.getInitializationError();

  constructor(private engineService: NgParticlesEngineService) {}

  syncCheck(): void {
    if (this.engineService.isReady()) {
      console.log("Engine is ready now");
    }
  }
}
```

### Async Monitoring

```typescript
export class MyComponent implements OnInit {
  constructor(private engineService: NgParticlesEngineService) {}

  ngOnInit(): void {
    this.engineService.getInstallationStatus().subscribe((isReady) => {
      if (isReady) {
        console.log("Engine initialization complete");
      }
    });

    this.engineService.getInitializationError().subscribe((error) => {
      if (error) {
        console.error("Engine initialization failed:", error);
      }
    });
  }
}
```

## Legacy Pattern (Backward Compat)

Components still support inline initialization:

```typescript
@Component({
  selector: "app-legacy-particles",
  standalone: true,
  imports: [NgxParticlesComponent],
  template: `
    <ngx-particles
      [useEngineService]="false"
      [particlesInit]="initParticles"
    ></ngx-particles>
  `,
})
export class LegacyComponent {
  async initParticles(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
```

## Module Pattern (if not using standalone)

```typescript
import { NgModule } from "@angular/core";
import { NgxParticlesModule } from "@tsparticles/angular";

@NgModule({
  imports: [NgxParticlesModule],
  declarations: [MyComponent],
})
export class MyModule {}
```

## TypeScript

Full type support:

```typescript
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import {
  NgxParticlesComponent,
  NgParticlesEngineService,
} from "@tsparticles/angular";

export class ConfiguredParticles {
  options: ISourceOptions = {
    // typed options
  };

  constructor(private engineService: NgParticlesEngineService) {}

  async loadEngine(): Promise<Engine> {
    return this.engineService.init(async (engine) => {
      // init logic
    });
  }
}
```

## Migration Guide

### Before (Old Pattern)

```typescript
// Each component calls init
<ngx-particles
  [particlesInit]="initParticles"
  (particlesLoaded)="onLoaded"
></ngx-particles>
```

### After (New Pattern)

```typescript
// App-level init
engineService.init(particlesInit);

// Components just render
<ngx-particles [options]="config"></ngx-particles>
```

## Control Flow

```
App Startup
  ↓
inject(NgParticlesEngineService).init(...)
  ↓
Engine + plugins loaded once
  ↓
Components use shared engine via DI
  ↓
Each <ngx-particles> instance is lightweight
  ↓
Load individual particle configs
```
