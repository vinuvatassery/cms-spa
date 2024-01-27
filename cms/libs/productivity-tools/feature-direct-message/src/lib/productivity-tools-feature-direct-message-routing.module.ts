/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';

const routes: Routes = [
  {
    path: '',
    component: DirectMessagePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureDirectMessageRoutingModule {}
