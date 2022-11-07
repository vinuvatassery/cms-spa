/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { SearchPageComponent } from './containers/search-page/search-page.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseManagementFeatureSearchRoutingModule {}
