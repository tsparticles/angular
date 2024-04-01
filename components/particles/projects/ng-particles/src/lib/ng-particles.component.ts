import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { tsParticles } from '@tsparticles/engine';
import type { Container } from '@tsparticles/engine';
import { IParticlesProps } from './ng-particles.module';
import { NgParticlesService } from './ng-particles.service';

@Component({
  selector: 'ngx-particles',
  template: '<div [id]="id"></div>',
})
export class NgxParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() options?: IParticlesProps;
  @Input() url?: string;
  @Input() id: string;
  @Output() particlesLoaded: EventEmitter<Container> = new EventEmitter<Container>();

  private container?: Container;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
    private readonly particlesService: NgParticlesService,
  ) {
    this.id = 'tsparticles';
  }

  public async ngOnInit() {
    if (await this.particlesService.getInstallationStatus()) {
      this.container?.destroy();
      this.loadParticles();
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.loadParticles();
  }

  public ngOnDestroy(): void {
    this.container?.destroy();
  }

  private loadParticles(): void {
    tsParticles.load({ id: this.id, url: this.url, options: this.options })
      .then(container => {
        this.container = container;
        this.particlesLoaded.emit(container);
      })
      .catch(error => console.error(error));
  }
}
