/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendLetterPageComponent } from './containers/send-letter-page/send-letter-page.component';
const routes: Routes = [
  {
    path: 'disenroll',
    component: SendLetterPageComponent,
    data: {
      title: 'Send Notice',
    },
  },
  {
    path: '',
    redirectTo: 'eligibility',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureCommunicationRoutingModule {}
