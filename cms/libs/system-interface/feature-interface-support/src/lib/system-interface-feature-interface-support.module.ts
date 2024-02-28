import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router'; 
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { InterfaceSupportPageComponent } from './container/interface-support-page/interface-support-page.component';
import { SupportGroupComponent } from './components/support-group/support-group.component';
import { DistributionListsComponent } from './components/distribution-lists/distribution-lists.component';
import { NotificationCategoryComponent } from './components/notification-category/notification-category.component'
import { SystemInterfaceFeatureInterfaceSupportRoutingModule } from './system-interface-feature-interface-support.routing.module';

@NgModule({
  imports: [
    CommonModule, 
    SharedUiTpaModule,
    SharedUiCommonModule,
    SystemInterfaceFeatureInterfaceSupportRoutingModule
  ],
  declarations: [
    InterfaceSupportPageComponent,
    SupportGroupComponent,
    DistributionListsComponent,
    NotificationCategoryComponent,
  ],
  exports: [
    InterfaceSupportPageComponent,
    SupportGroupComponent,
    DistributionListsComponent,
    NotificationCategoryComponent,
  ],
})
export class SystemInterfaceFeatureInterfaceSupportModule {}
