import { Component } from "@angular/core";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import configs from "tsparticles-demo-configs";
import { TsParticlesAngular7Module } from '@tsparticles/angular-7';
// or
import { TsParticlesAngular8Module } from '@tsparticles/angular-8';
// or
import { TsParticlesAngular9Module } from '@tsparticles/angular-9';
// or
import { TsParticlesAngular10Module } from '@tsparticles/angular-10';
// or
import { TsParticlesAngular11Module } from '@tsparticles/angular-11';
// or
import { TsParticlesAngular12Module } from '@tsparticles/angular-12';

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  particlesId = "tsparticles";
  particlesOptions = configs.basic;

  constructor() {
  }

  particlesLoaded(container: Container): void {
    // Credits to :  https://github.com/matteobruni
    setTimeout(async () => {
      container.refresh();
    }, 500);
  }

  async particlesInit(main: Engine): Promise<void> {
    await loadFull(main);
  }
}
