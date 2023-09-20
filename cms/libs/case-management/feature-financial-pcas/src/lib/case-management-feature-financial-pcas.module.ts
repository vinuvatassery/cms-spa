import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CaseManagementFeatureFinancialPcasRoutingModule } from './case-management-feature-financial-pcas.routing.module';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { FinancialPcasPageComponent } from './containers/financial-pcas-page/financial-pcas-page.component';
import { FinancialPcasAssignmentListComponent } from './components/financial-pcas-assignment-list/financial-pcas-assignment-list.component';
import { FinancialPcasSetupListComponent } from './components/financial-pcas-setup-list/financial-pcas-setup-list.component';
import { FinancialPcasReassignmentListComponent } from './components/financial-pcas-reassignment-list/financial-pcas-reassignment-list.component';
import { FinancialPcasAssignmentReportListComponent } from './components/financial-pcas-assignment-report-list/financial-pcas-assignment-report-list.component';
import { FinancialPcasSetupFormComponent } from './components/financial-pcas-setup-form/financial-pcas-setup-form.component';
import { FinancialPcasSetupRemoveComponent } from './components/financial-pcas-setup-remove/financial-pcas-setup-remove.component';
import { FinancialPcasReassignmentFormComponent } from './components/financial-pcas-reassignment-form/financial-pcas-reassignment-form.component';
import { FinancialPcasReassignmentConfirmationComponent } from './components/financial-pcas-reassignment-confirmation/financial-pcas-reassignment-confirmation.component';
import { FinancialPcasAssignmentFormComponent } from './components/financial-pcas-assignment-form/financial-pcas-assignment-form.component';
import { FinancialPcasAssignmentRemoveComponent } from './components/financial-pcas-assignment-remove/financial-pcas-assignment-remove.component';
import { FinancialPcasAssignmentReportPreviewSubmitComponent } from './components/financial-pcas-assignment-report-preview-submit/financial-pcas-assignment-report-preview-submit.component';
import { FinancialPcasAssignmentSubReportListComponent } from './components/financial-pcas-assignment-sub-report-list/financial-pcas-assignment-sub-report-list.component';
@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    RouterModule,
    CaseManagementFeatureFinancialPcasRoutingModule,
  ],
  declarations: [
    FinancialPcasPageComponent,
    FinancialPcasAssignmentListComponent,
    FinancialPcasSetupListComponent,
    FinancialPcasReassignmentListComponent,
    FinancialPcasAssignmentReportListComponent,
    FinancialPcasSetupFormComponent,
    FinancialPcasSetupRemoveComponent,
    FinancialPcasReassignmentFormComponent,
    FinancialPcasReassignmentConfirmationComponent,
    FinancialPcasAssignmentFormComponent,
    FinancialPcasAssignmentRemoveComponent,
    //FinancialPcasAssignmentReportAlertComponent,
    FinancialPcasAssignmentReportPreviewSubmitComponent,
    FinancialPcasAssignmentSubReportListComponent
  ],
  exports: [

    FinancialPcasAssignmentListComponent,
    FinancialPcasSetupListComponent,
    FinancialPcasReassignmentListComponent,
    FinancialPcasAssignmentReportListComponent,
    FinancialPcasSetupFormComponent,
    FinancialPcasSetupRemoveComponent,
    FinancialPcasReassignmentFormComponent,
    FinancialPcasReassignmentConfirmationComponent,
    FinancialPcasAssignmentFormComponent,
    FinancialPcasAssignmentRemoveComponent,
    //FinancialPcasAssignmentReportAlertComponent,
    FinancialPcasAssignmentReportPreviewSubmitComponent,

  ],
})
export class CaseManagementFeatureFinancialPcasModule {}
