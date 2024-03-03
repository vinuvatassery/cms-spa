/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';
import { DirectMessageFabComponent } from './containers/direct-message-fab/direct-message-fab.component';

const routes: Routes = [
  {
    path: '',
    component: DirectMessageFabComponent,
  },
  {
    path: 'list',
    component: DirectMessagePageComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureDirectMessageRoutingModule {}
