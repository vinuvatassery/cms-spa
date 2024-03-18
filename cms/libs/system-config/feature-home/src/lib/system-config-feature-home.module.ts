import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SystemConfigDomainModule } from '@cms/system-config/domain';
import { SystemConfigFeatureHomeRoutingModule } from './system-config-feature-home.routing.module';
import { HomeMainRouterPageComponent } from './containers/home-main-router-page/home-main-router-page.component';
 
@NgModule({
  imports: [
    CommonModule,
    SystemConfigDomainModule,
    SystemConfigFeatureHomeRoutingModule,
    SharedUiCommonModule,
    SharedUiTpaModule, 
  ],
  declarations: [ 
    HomeMainRouterPageComponent
  ],
  exports: [ 
    HomeMainRouterPageComponent
  ],
})
export class SystemConfigFeatureHomeModule {}
