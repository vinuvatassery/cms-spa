import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasePageComponent } from './containers/case-page/case-page.component';

const routes: Routes = [
  {
    path: '',
    component: CasePageComponent,
    data: {
      title: null
    }, 
  },  
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ],  
  exports: [RouterModule],
})

export class CaseManagementFeatureCaseRoutingModule {}
