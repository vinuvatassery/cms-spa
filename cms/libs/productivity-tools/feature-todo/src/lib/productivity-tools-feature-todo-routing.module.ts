/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { TodoPageComponent } from './containers/todo-page/todo-page.component';
import { TodoAndRemindersFabPageComponent } from './containers/todo-and-reminders-fab-page/todo-and-reminders-fab-page.component';

const routes: Routes = [
  {
    path: '',
    component: TodoAndRemindersFabPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'list',
    component: TodoPageComponent,
    data: {
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureTodoRoutingModule {}
