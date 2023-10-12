import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './containers/app.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';

import { SharedUtilCoreModule } from '@cms/shared/util-core';
import { SharedUtilOidcModule } from '@cms/shared/util-oidc';
import { AppRoutingModule } from './app-routing.module';

import { LayoutComponent } from './components/layout/layout.component';
import { SharedUiCommonModule, SideNavigationComponent } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureNotificationModule } from '@cms/productivity-tools/feature-notification';
import { CaseManagementFeatureCaseModule } from '@cms/case-management/feature-case';
import { SystemConfigFeatureTemplateManagementModule } from '@cms/system-config/feature-template-management';
import {ICON_SETTINGS} from "@progress/kendo-angular-icons";
const COMPONENTS = [AppComponent, LayoutComponent, SideNavigationComponent];
@NgModule({
  declarations: [COMPONENTS],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedUtilCoreModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    AppRoutingModule,
    SharedUtilOidcModule,
    ProductivityToolsFeatureNotificationModule,
    CaseManagementFeatureCaseModule,
    SystemConfigFeatureTemplateManagementModule    
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'en-US' }, { provide: ICON_SETTINGS, useValue: { type: 'font' } } ],
  bootstrap: [AppComponent],
})
export class AppModule {}
