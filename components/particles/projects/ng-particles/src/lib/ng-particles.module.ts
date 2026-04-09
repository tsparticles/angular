import { NgModule } from "@angular/core";
import type { ISourceOptions } from "@tsparticles/engine";

import { NgxParticlesComponent } from "./ng-particles.component";
import { NgParticlesService } from "./ng-particles.service";

@NgModule({
  imports: [NgxParticlesComponent],
  exports: [NgxParticlesComponent],
  providers: [NgParticlesService],
})
export class NgxParticlesModule {}

export type IParticlesProps = ISourceOptions;
export { NgParticlesService, NgxParticlesComponent };
