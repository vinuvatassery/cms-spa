/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReminderNotificationSnackBarComponent } from './containers/reminder-notification-snack-bar/reminder-notification-snack-bar.component';


const routes: Routes = [
  {
    path: '',
    component: ReminderNotificationSnackBarComponent,
   
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureFabsMenuRoutingModule {}
