/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { ContactPageComponent } from './containers/contact-page/contact-page.component';
import { ProfileContactPageComponent } from './containers/profile-contact-page/profile-contact-page-component';

const routes: Routes = [
  {
    path: '',
    component: ContactPageComponent,
  },
  {
    path: 'profile',
    component: ProfileContactPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureContactRoutingModule {}
