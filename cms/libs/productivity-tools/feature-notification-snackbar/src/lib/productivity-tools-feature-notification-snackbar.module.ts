import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureFabsMenuRoutingModule } from './productivity-tools-feature-notification-snackbar-routing.module';
import { ReminderNotificationSnackBarComponent } from './containers/reminder-notification-snack-bar/reminder-notification-snack-bar.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureFabsMenuRoutingModule
  ],
  declarations: [
    ReminderNotificationSnackBarComponent
    
  ],
  exports: [
    ReminderNotificationSnackBarComponent
    
  ],
})
export class ProductivityToolsFeatureNotificationSnackbarModule {}