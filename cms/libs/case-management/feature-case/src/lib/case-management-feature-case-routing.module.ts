import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasePageComponent } from './containers/case-page/case-page.component';
import { Case360PageComponent } from './containers/case360-page/case360-page.component';
import { CaseSummaryComponent } from './containers/case-summary/case-summary.component';

const routes: Routes = [
  {
    path: '',
    component: CasePageComponent,
    data: {
      title: null
    }, 
  },  
  {
    path: 'case360/:id',
    component: Case360PageComponent,
    data: {
      title: null,
    }, 
  },
  {
    path: 'case-summary',
    component: CaseSummaryComponent,
    data: {
      title: null,
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
