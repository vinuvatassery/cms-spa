/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonActionsComponent } from './containers/common-actions/common-actions.component';

const routes: Routes = [
  {
    path: '',
    component: CommonActionsComponent,
    children: [
      {
        outlet: 'eventLog',
        path: '',
        loadChildren: () =>
          import('@cms/productivity-tools/feature-event-log').then(
            (m) => m.ProductivityToolsFeatureEventLogModule
          ),
      },
      {
        outlet: 'directMessage',
        path: '',
        loadChildren: () =>
          import('@cms/productivity-tools/feature-direct-message').then(
            (m) => m.ProductivityToolsFeatureDirectMessageModule
          ),
      },
      {
        outlet: 'todoReminder',
        path: '',
        loadChildren: () =>
          import('@cms/productivity-tools/feature-todo').then(
            (m) => m.ProductivityToolsFeatureTodoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureFabsMenuRoutingModule {}
