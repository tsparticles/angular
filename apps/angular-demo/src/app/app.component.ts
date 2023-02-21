import { Component } from '@angular/core';
import type { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { basic } from 'tsparticles-demo-configs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular13';
  id = 'tsparticles';
  fire = 0;
  particlesVisible = true;
  fireworksVisible = false;
  confettiVisible = true;
  particlesOptions: ISourceOptions = basic;
  confettiOptions = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  };
  fireworksOptions = {};

  toggleParticlesClick(): void {
    console.log('particles clicked');

    this.particlesVisible = !this.particlesVisible;
  }

  toggleFireworksClick(): void {
    console.log('fireworks clicked');

    this.fireworksVisible = !this.fireworksVisible;
  }

  toggleConfettiClick(): void {
    console.log('confetti clicked');

    this.fire = Math.random() + 1;
    //this.confettiVisible = !this.confettiVisible;
  }

  constructor() {}

  ngOnInit(): void {}

  async particlesInit(engine: Engine): Promise<void> {
    console.log('init', engine);

    await loadFull(engine);
  }

  public particlesLoaded(container: Container): void {
    console.log('loaded', container);
  }
}
