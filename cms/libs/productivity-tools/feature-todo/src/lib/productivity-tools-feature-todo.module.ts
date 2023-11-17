import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ProductivityToolsDomainModule } from '@cms/productivity-tools/domain';
import { TodoComponent } from './todo.component';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent,
    data: { title: 'Todo' },
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProductivityToolsDomainModule,
  ],
  declarations: [TodoComponent],
  exports: [TodoComponent],
})
export class ProductivityToolsFeatureTodoModule {}
