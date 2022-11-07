/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SystemConfigDomainModule } from '@cms/system-config/domain';
import { SystemConfigFeatureLovRoutingModule } from './system-config-feature-lov-routing.module';
/** Components **/
import { LovPageComponent } from './containers/lov-page/lov-page.component';

@NgModule({
  imports: [
    CommonModule,
    SystemConfigDomainModule,
    SystemConfigFeatureLovRoutingModule,
    SharedUiCommonModule,
  ],
  declarations: [LovPageComponent],
  exports: [LovPageComponent],
})
export class SystemConfigFeatureLovModule {}
