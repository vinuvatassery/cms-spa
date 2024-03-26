import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { ProductivityToolsFeatureFabsMenuRoutingModule } from './productivity-tools-feature-notification-snackbar-routing.module';
import { ReminderNotificationSnackBarComponent } from './containers/reminder-notification-snack-bar/reminder-notification-snack-bar.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { ProductivityToolsFeatureTodoModule } from '@cms/productivity-tools/feature-todo';
import { ReminderNotificationSnackBarsComponent } from './components/reminder-notification-snack-bars/reminder-notification-snack-bars.component';
import { ReminderNotificationSnackBarsTemplateComponent } from './components/reminder-notification-snack-bar-template/reminder-notification-snack-bar-template.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    ProductivityToolsFeatureFabsMenuRoutingModule,
    ProductivityToolsFeatureTodoModule,
    GridsterModule,
    DynamicModule,
    
  ],
  declarations: [
    ReminderNotificationSnackBarComponent,
    ReminderNotificationSnackBarsTemplateComponent,
    ReminderNotificationSnackBarsComponent    
  ],
  exports: [
    ReminderNotificationSnackBarComponent,
    ReminderNotificationSnackBarsTemplateComponent
    
  ],
})
export class ProductivityToolsFeatureNotificationSnackbarModule {}
