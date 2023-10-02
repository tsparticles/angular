import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
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

describe('AppComponent', () => {

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
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
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  // TODO: add more tests!

});
