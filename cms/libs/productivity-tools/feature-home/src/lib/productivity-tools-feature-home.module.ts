import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'todo-items',
    loadChildren: () =>
      import('@cms/productivity-tools/feature-todo').then(
        (m) => m.ProductivityToolsFeatureTodoModule
      ),
      data: {
        title: 'To Do Items',
      },
  },
  {
    path: 'direct-message',
    loadChildren: () =>
      import('@cms/productivity-tools/feature-direct-message').then(
        (m) => m.ProductivityToolsFeatureDirectMessageModule
      ),
  },
  {
    path: '',
    redirectTo: 'todo-items',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProductivityToolsFeatureHomeModule {}
