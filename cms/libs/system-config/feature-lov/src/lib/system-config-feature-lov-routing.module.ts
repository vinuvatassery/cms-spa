/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** Components **/
import { LovPageComponent } from './containers/lov-page/lov-page.component';

const routes: Routes = [
  {
    path: '',
    component: LovPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureLovRoutingModule {}
