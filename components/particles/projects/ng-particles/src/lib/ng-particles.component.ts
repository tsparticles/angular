import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  ViewChild,
  signal,
} from "@angular/core";
import { NgClass, NgStyle, isPlatformServer } from "@angular/common";
import { tsParticles } from "@tsparticles/engine";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";

import { NgParticlesService } from "./ng-particles.service";
import { NgParticlesEngineService } from "./ng-particles-engine.service";

@Component({
  standalone: true,
  selector: "ngx-particles",
  imports: [NgClass, NgStyle],
  template: '<div #particlesContainer [id]="id()" [ngClass]="containerClass" [ngStyle]="containerStyle"></div>',
})
export class NgxParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("particlesContainer", { static: false })
  particlesContainer?: ElementRef<HTMLDivElement>;

  @Input() options?: ISourceOptions;
  @Input() url?: string;
  @Input() id = signal("tsparticles");
  @Input() containerClass?: string | string[] | Set<string> | { [klass: string]: any };
  @Input() containerStyle?: { [klass: string]: any };
  @Input() particlesInit?: (engine: Engine) => Promise<void> | void;
  @Input() useEngineService = true; // Enable centralized engine by default

  @Output() particlesLoaded = new EventEmitter<Container | undefined>();

  private container?: Container;
  private initialized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private ngZone: NgZone,
    @Optional() private particlesService?: NgParticlesService,
    @Optional() private engineService?: NgParticlesEngineService,
  ) {}

  public ngOnInit(): void {
    if (this.useEngineService && this.engineService?.isReady()) {
      this.loadParticles();
    } else if (this.particlesService) {
      this.particlesService.getInstallationStatus().subscribe((status) => {
        if (status && !this.initialized) {
          this.initialized = true;
          this.loadParticles();
        }
      });
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (!this.particlesService && !this.initialized) {
      this.initialized = true;
      this.loadParticles();
    }
  }

  public ngOnDestroy(): void {
    this.container?.destroy();
  }

  private loadParticles(): void {
    this.ngZone.runOutsideAngular(async () => {
      try {
        let engine: Engine;

        if (this.useEngineService && this.engineService) {
          engine = this.engineService.getEngine();
        } else {
          engine = tsParticles;
        }

        if (this.particlesInit) {
          // Only call particlesInit if engine is not from service
          if (!this.useEngineService) {
            await this.particlesInit(tsParticles);
          }
        }

        const container = await engine.load({
          id: this.id(),
          url: this.url,
          options: this.options,
        });

        this.container = container;

        this.ngZone.run(() => {
          this.particlesLoaded.emit(container);
        });
      } catch (error) {
        console.error("Failed to load particles:", error);
        this.ngZone.run(() => {
          this.particlesLoaded.emit(undefined);
        });
      }
    });
  }
}
