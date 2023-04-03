/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { DocumentPageComponent } from './containers/document-page/document-page.component';
import { ProfileDocumentPageComponent } from './containers/profile-document-page/profile-document-page.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentPageComponent,
  },
  {
    path: 'profile',
    component: ProfileDocumentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureDocumentRoutingModule {}
