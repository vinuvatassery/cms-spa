/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { DrugPageComponent } from './containers/drug-page/drug-page.component';

const routes: Routes = [
  {
    path: '',
    component: DrugPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureDrugRoutingModule {}
