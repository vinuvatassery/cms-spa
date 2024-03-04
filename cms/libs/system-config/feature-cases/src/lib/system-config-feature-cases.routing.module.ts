import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
import { CaseAssignmentPageComponent } from './containers/case-assignment-page/case-assignment-page.component';
import { EligibilityCheckPageComponent } from './containers/eligibility-check-page/eligibility-check-page.component';
 

const routes: Routes = [
  {
    path: ' ',
    component: CaseAssignmentPageComponent,
  },
  {
    path: 'case-assignment',
    component: CaseAssignmentPageComponent,
  },
  {
    path: 'eligibility-checklist',
    component: EligibilityCheckPageComponent,
  },
 
];
@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureCasesRoutingModule {}
