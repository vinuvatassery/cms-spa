import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseAssignmentPageComponent } from './containers/case-assignment-page/case-assignment-page.component';
import { EligibilityCheckPageComponent } from './containers/eligibility-check-page/eligibility-check-page.component';
 

const routes: Routes = [
  {
    path: '',
    component: CaseAssignmentPageComponent,
    data: {
      title: 'Case Assignment',
    },
  },
  {
    path: 'case-management',
    component: CaseAssignmentPageComponent,
    data: {
      title: 'Case Assignment',
    },
  },
  {
    path: 'eligibility-checklist',
    component: EligibilityCheckPageComponent,
    data: {
      title: 'Eligibility Checklist',
    },
  },
 
];
@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureCasesRoutingModule {}
