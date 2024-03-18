import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AssisterGroupsPageComponent } from './containers/assister-groups-page/assister-groups-page.component';
import { DomainPageComponent } from './containers/domain-page/domain-page.component';
 
 

const routes: Routes = [
  {
    path: 'assister-groups',
    component: AssisterGroupsPageComponent,
  }, 
  {
    path: 'domains',
    component: DomainPageComponent,
  }, 
  {
    path: '',
    redirectTo: 'assister-groups',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureOtherListsRoutingModule {}
