/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { DrugPageComponent } from './containers/drug-page/drug-page.component';
import { ProfileDrugPageComponent } from './containers/profile-drug-page/profile-drug-page.component';

const routes: Routes = [
  {
    path: '',
    component: DrugPageComponent,
  }, {
    path: 'profile',
    component: ProfileDrugPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureDrugRoutingModule {}
