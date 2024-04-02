/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureTodoModule } from '@cms/productivity-tools/feature-todo';
import { ProductivityToolsFeatureNotificationRoutingModule } from './productivity-tools-feature-notification-routing.module';
/** Components **/
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationPanelComponent } from './components/notification-panel/notification-panel.component';
import { NotificationPageComponent } from './containers/notification-page/notification-page.component';
import { NotificationAndReminderPageComponent } from './containers/notification-and-reminder-page/notification-and-reminder-page.component';
import { AlertBannerComponent } from './containers/alert-banner/alert-banner.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    ProductivityToolsFeatureNotificationRoutingModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureTodoModule,
  ],
  declarations: [
    NotificationListComponent,
    NotificationPanelComponent,
    NotificationPageComponent,
    NotificationAndReminderPageComponent,
    AlertBannerComponent,
  ],
  exports: [
    NotificationListComponent,
    NotificationPanelComponent,
    NotificationPageComponent,
    NotificationAndReminderPageComponent,
    AlertBannerComponent,
  ],
})
export class ProductivityToolsFeatureNotificationModule {}
