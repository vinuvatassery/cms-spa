import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiKendoModule } from 'libs/shared/ui-kendo/src';
import { AppRoutingModule } from './app.routing.module';
import { DashboardUiModule } from '@cms/dashboard/ui';
import { SharedAuthFeatureAuthenticationModule } from '@cms/shared/auth/feature-authentication';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedUiCommonModule,
    SharedUiKendoModule,
    DashboardUiModule,
    SharedAuthFeatureAuthenticationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
