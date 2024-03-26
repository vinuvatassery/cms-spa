import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureFabsMenuRoutingModule } from './productivity-tools-feature-notification-snackbar-routing.module';
import { ReminderNotificationSnackBarComponent } from './containers/reminder-notification-snack-bar/reminder-notification-snack-bar.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { ProductivityToolsFeatureTodoModule } from '@cms/productivity-tools/feature-todo';
import { ReminderSnackBarTemplateComponent } from './containers/reminder-snackbar-template/reminder-snackbar-template.component';
@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureFabsMenuRoutingModule,
    ProductivityToolsFeatureTodoModule,
    
  ],
  declarations: [
    ReminderNotificationSnackBarComponent,
    ReminderSnackBarTemplateComponent
    
  ],
  exports: [
    ReminderNotificationSnackBarComponent,
    ReminderSnackBarTemplateComponent
    
  ],
})
export class ProductivityToolsFeatureNotificationSnackbarModule {}
