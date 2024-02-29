/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectMessagePageComponent } from './containers/direct-message-page/direct-message-page.component';
import { CommonActionsComponent } from './components/common-actions/common-actions.component';

const routes: Routes = [
  {
    path: '',
    component: CommonActionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureDirectMessageRoutingModule {}
