import { NgModule } from '@angular/core';
import { NgxParticlesComponent } from './ng-particles.component';
import type { ISourceOptions } from '@tsparticles/engine';

@NgModule({
    declarations: [NgxParticlesComponent],
    exports: [NgxParticlesComponent],
})
export class NgxParticlesModule {}

export type IParticlesProps = ISourceOptions;
export type IParticlesParams = IParticlesProps;
