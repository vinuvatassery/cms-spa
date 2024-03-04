/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventLogComponentFabPageComponent } from './containers/event-log-fab-page/event-log-fab-page.component';

const routes: Routes = [
  {
    path: '',
    component: EventLogComponentFabPageComponent,

  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductivityToolsFeatureEventLogRoutingModule {}
