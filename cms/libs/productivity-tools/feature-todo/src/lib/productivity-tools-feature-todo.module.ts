/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { ProductivityToolsFeatureTodoRoutingModule } from './productivity-tools-feature-todo-routing.module';
/** Components **/
import { TodoPageComponent } from './containers/todo-page/todo-page.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
import { ReminderDetailComponent } from './components/reminder-detail/reminder-detail.component';
import { DeleteReminderConfirmationComponent } from './components/delete-reminder-confirmation/delete-reminder-confirmation.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoAndRemindersPageComponent } from './containers/todo-and-reminders-page/todo-and-reminders-page.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';
import { SubEventsDetailsComponent } from './components/sub-events-details/sub-events-details.component';
import { TodoAndRemindersFabPageComponent } from './containers/todo-and-reminders-fab-page/todo-and-reminders-fab-page.component';

@NgModule({
  imports: [
    CommonModule,
    ProductivityToolsFeatureTodoRoutingModule,
    ProductivityToolsDomainModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    SystemConfigFeatureUserManagementModule,
  ],
  declarations: [
    TodoPageComponent,
    ReminderListComponent,
    ReminderDetailComponent,
    DeleteReminderConfirmationComponent,
    TodoListComponent,
    TodoAndRemindersPageComponent,
    TodoItemComponent,
    ReminderItemComponent,
    SubEventsDetailsComponent,
    TodoAndRemindersFabPageComponent
  ],
  exports: [
    TodoPageComponent,
    ReminderListComponent,
    ReminderDetailComponent,
    DeleteReminderConfirmationComponent,
    TodoListComponent,
    TodoAndRemindersPageComponent,
    TodoItemComponent,
    ReminderItemComponent,
    TodoAndRemindersFabPageComponent
  ],
})
export class ProductivityToolsFeatureTodoModule {}
