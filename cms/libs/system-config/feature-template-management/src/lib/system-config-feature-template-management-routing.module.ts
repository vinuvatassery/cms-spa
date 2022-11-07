/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { FormsAndDocumentsPageComponent } from './containers/forms-and-documents-page/forms-and-documents-page.component';

const routes: Routes = [
  {
    path: '',
    component: FormsAndDocumentsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureTemplateManagementRoutingModule {}
