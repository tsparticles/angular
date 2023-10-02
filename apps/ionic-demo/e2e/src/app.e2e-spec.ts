import { AppPage } from './app.po';
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

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getPageTitle()).toContain('Tab 1');
  });
});
