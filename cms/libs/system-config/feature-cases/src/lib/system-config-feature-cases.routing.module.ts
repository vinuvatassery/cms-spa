import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
import { EligibilityCheckListComponent } from './components/eligibility-check-list/eligibility-check-list.component';

const routes: Routes = [
  {
    path: '',
    component: CaseAssignmentComponent,
    children: [
      {
        path: 'case-assignment',
        component: CaseAssignmentComponent,
      },
      {
        path: 'eligibility-checklist',
        component: EligibilityCheckListComponent,
      },
      {
        path: '',
        redirectTo: 'case-assignment',
        pathMatch: 'full',
      },
    ],
  }, 
];
export class SystemConfigFeatureCasesRoutingModule {}
