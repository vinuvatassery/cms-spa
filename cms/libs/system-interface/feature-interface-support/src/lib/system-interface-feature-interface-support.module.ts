import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { InterfaceSupportPageComponent } from './container/interface-support-page/interface-support-page.component';
import { SupportGroupComponent } from './components/support-group/support-group.component';
import { DistributionListsComponent } from './components/distribution-lists/distribution-lists.component';
import { NotificationCategoryComponent } from './components/notification-category/notification-category.component'
import { SystemInterfaceFeatureInterfaceSupportRoutingModule } from './system-interface-feature-interface-support.routing.module';
import { SupportGroupDetailComponent } from './components/support-group-detail/support-group-detail.component';
import { DeactivateSupportGroupComponent } from './components/deactivate-support-group/deactivate-support-group.component';
import { ReactivateSupportGroupComponent } from './components/reactivate-support-group/reactivate-support-group.component';
import { RemoveSupportGroupComponent } from './components/remove-support-group/remove-support-group.component';
import { NotiificationGroupDetailComponent } from './components/notification-category-detail/notification-category-detail.component';

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
    SupportGroupDetailComponent,
    DeactivateSupportGroupComponent,
    ReactivateSupportGroupComponent,
    RemoveSupportGroupComponent,
    NotiificationGroupDetailComponent
  ],
  exports: [
    InterfaceSupportPageComponent,
    SupportGroupComponent,
    DistributionListsComponent,
    NotificationCategoryComponent,
    SupportGroupDetailComponent,
    DeactivateSupportGroupComponent,
    ReactivateSupportGroupComponent,
    RemoveSupportGroupComponent,
    NotiificationGroupDetailComponent
  ],
})
export class SystemInterfaceFeatureInterfaceSupportModule {}
