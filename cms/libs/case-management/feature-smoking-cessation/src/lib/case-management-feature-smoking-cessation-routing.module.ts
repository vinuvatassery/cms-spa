/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { SmokingCessationPageComponent } from './containers/smoking-cessation-page/smoking-cessation-page.component';
import { ProfileSmokingCessationPageComponent } from './containers/profile-smoking-cessation-page/profile-smoking-cessation-page.component';

const routes: Routes = [
  {
    path: '',
    component: SmokingCessationPageComponent,
  },
  {
    path: 'profile',
    component: ProfileSmokingCessationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureSmokingCessationRoutingModule {}
