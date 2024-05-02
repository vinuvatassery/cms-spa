import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CpAppComponent } from './containers/app.component';
import { AppRoutingModule } from './app-routing.module';
import { FeatureClientPortalHomeModule } from "@cms/feature-client-portal-home";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUtilCoreModule } from '@cms/shared/util-core'; 
import { CpLayoutComponent } from './components/layout/layout.component';
// import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ICON_SETTINGS } from '@progress/kendo-angular-icons';
const COMPONENTS = [CpAppComponent, CpLayoutComponent, ];
@NgModule({

    declarations: [COMPONENTS],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      SharedUtilCoreModule,
      SharedUiTpaModule, 
      AppRoutingModule, 
      FeatureClientPortalHomeModule  
    ],
    providers: [ { provide: LOCALE_ID, useValue: 'en-US' }, { provide: ICON_SETTINGS, useValue: { type: 'font' } } ],
    bootstrap: [CpAppComponent],
})
export class AppModule {}
