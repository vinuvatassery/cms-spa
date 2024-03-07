import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { EligibilityCheckListComponent } from './components//eligibility-check-list/eligibility-check-list.component';
import { CaseAssignmentComponent } from './components/case-assignment/case-assignment.component';
import { CaseAssignmentPageComponent } from './containers/case-assignment-page/case-assignment-page.component';
import { EligibilityCheckPageComponent } from './containers/eligibility-check-page/eligibility-check-page.component';
import { SystemConfigFeatureCasesRoutingModule } from './system-config-feature-cases.routing.module';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureCasesRoutingModule],
  declarations: [
    EligibilityCheckListComponent,
    CaseAssignmentComponent,
    CaseAssignmentPageComponent,
    EligibilityCheckPageComponent,
  ],
  exports: [CaseAssignmentPageComponent, EligibilityCheckPageComponent],
})
export class SystemConfigFeatureCasesModule {}
