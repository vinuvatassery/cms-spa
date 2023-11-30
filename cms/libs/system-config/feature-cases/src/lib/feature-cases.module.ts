import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { EligibilityCheckListComponent } from './components//eligibility-check-list/eligibility-check-list.component';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
 


@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [EligibilityCheckListComponent, CaseAssignmentComponent],
})
export class FeatureCasesModule {}
