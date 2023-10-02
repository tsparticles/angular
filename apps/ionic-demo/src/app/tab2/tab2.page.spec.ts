import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

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

import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [
        IonicModule.forRoot(),
        ExploreContainerComponentModule,
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Tab2Page],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
