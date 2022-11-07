/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { FamilyAndDependentPageComponent } from './container/family-and-dependent-page/family-and-dependent-page.component';
const routes: Routes = [
  {
    path: '',
    component: FamilyAndDependentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureFamilyAndDependentRoutingModule {}
