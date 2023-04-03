/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { HealthcareProviderPageComponent } from './containers/healthcare-provider-page/healthcare-provider-page.component';
import { ProfileHealthcareProviderPageComponent } from './containers/profile-healthcare-provider-page/profile-healthcare-provider-page.component';

const routes: Routes = [
  {
    path: '',
    component: HealthcareProviderPageComponent,
  },
  {
    path: 'profile',
    component: ProfileHealthcareProviderPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureHealthcareProviderRoutingModule {}
