import { Component } from '@angular/core';
import { NgParticlesService } from "@tsparticles/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.scss' ],
})
export class AppComponent {
  constructor(private ngParticlesService: NgParticlesService) {
  }

  ngOnInit(): void {
    void this.ngParticlesService.init(async (engine) => {
      console.log("init", engine);

      const { loadFull } = await import("tsparticles");

      await loadFull(engine);
    });
  }
}
