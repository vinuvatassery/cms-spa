/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { DashBoardLayoutContainerComponent } from './containers/dashboard-layout-container/dashboard-layout-container.component';

const routes: Routes = [
  {
    path: '',
    component: DashBoardLayoutContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardFeatureDashboardRoutingModule {}
