import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ParticlesModule } from 'ng-particles';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ParticlesModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
