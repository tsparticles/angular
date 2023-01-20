import { NgModule } from '@angular/core';
import { ParticlesComponent } from './angular-particles.component';
import type { ISourceOptions } from '@tsparticles/engine';

@NgModule({
    declarations: [ParticlesComponent],
    exports: [ParticlesComponent],
})
export class ParticlesModule {}

export type IParticlesProps = ISourceOptions;
export type IParticlesParams = IParticlesProps;
