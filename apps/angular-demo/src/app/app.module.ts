import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgParticlesModule } from 'ng-particles';
import { NgConfettiModule } from 'ng-confetti';
import { NgFireworksModule } from 'ng-fireworks';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import and use the appropriate package for the desired Angular version
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgParticlesModule,
    NgConfettiModule,
    NgFireworksModule,
    // Add the appropriate package to the imports array based on the desired Angular version
    TsParticlesAngular7Module,
    // or
    TsParticlesAngular8Module,
    // or
    TsParticlesAngular9Module,
    // or
    TsParticlesAngular10Module,
    // or
    TsParticlesAngular11Module,
    // or
    TsParticlesAngular12Module
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
