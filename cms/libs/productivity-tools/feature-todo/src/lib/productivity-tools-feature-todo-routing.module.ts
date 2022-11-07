/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { TodoPageComponent } from './containers/todo-page/todo-page.component';

const routes: Routes = [
  {
    path: '',
    component: TodoPageComponent,
    data: {
      title: null,
    }, 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureTodoRoutingModule {}
