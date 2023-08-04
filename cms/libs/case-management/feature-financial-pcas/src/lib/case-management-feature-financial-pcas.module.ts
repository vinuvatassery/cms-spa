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
import { FinancialPcasObjectGroupAssignmentComponent } from './components/financial-pcas-object-group-assignment/financial-pcas-object-group-assignment.component';
import { FinancialPcasGroupListComponent } from './components/financial-pcas-group-list/financial-pcas-group-list.component';
import { FinancialPcasObjectListComponent } from './components/financial-pcas-object-list/financial-pcas-object-list.component';
import { FinancialPcasSetupFormComponent } from './components/financial-pcas-setup-form/financial-pcas-setup-form.component';
import { FinancialPcasSetupRemoveComponent } from './components/financial-pcas-setup-remove/financial-pcas-setup-remove.component';
import { FinancialPcasReassignmentFormComponent } from './components/financial-pcas-reassignment-form/financial-pcas-reassignment-form.component';
import { FinancialPcasReassignmentConfirmationComponent } from './components/financial-pcas-reassignment-confirmation/financial-pcas-reassignment-confirmation.component';
import { FinancialPcasAssignmentFormComponent } from './components/financial-pcas-assignment-form/financial-pcas-assignment-form.component';
import { FinancialPcasAssignmentRemoveComponent } from './components/financial-pcas-assignment-remove/financial-pcas-assignment-remove.component';
import { FinancialPcasAssignmentReportAlertComponent } from './components/financial-pcas-assignment-report-alert/financial-pcas-assignment-report-alert.component';
import { FinancialPcasAssignmentReportPreviewSubmitComponent } from './components/financial-pcas-assignment-report-preview-submit/financial-pcas-assignment-report-preview-submit.component';
import { FinancialPcasObjectFormComponent } from './components/financial-pcas-object-form/financial-pcas-object-form.component';
import { FinancialPcasObjectDeleteComponent } from './components/financial-pcas-object-delete/financial-pcas-object-delete.component';
import { FinancialPcasObjectActivateComponent } from './components/financial-pcas-object-activate/financial-pcas-object-activate.component';
import { FinancialPcasObjectDeactivateComponent } from './components/financial-pcas-object-deactivate/financial-pcas-object-deactivate.component';
import { FinancialPcasGroupDeactivateComponent } from './components/financial-pcas-group-deactivate/financial-pcas-group-deactivate.component';
import { FinancialPcasGroupActivateComponent } from './components/financial-pcas-group-activate/financial-pcas-group-activate.component';
import { FinancialPcasGroupDeleteComponent } from './components/financial-pcas-group-delete/financial-pcas-group-delete.component';
import { FinancialPcasGroupFormComponent } from './components/financial-pcas-group-form/financial-pcas-group-form.component';

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
    FinancialPcasObjectGroupAssignmentComponent,
    FinancialPcasGroupListComponent,
    FinancialPcasObjectListComponent,
    FinancialPcasSetupFormComponent,
    FinancialPcasSetupRemoveComponent,
    FinancialPcasReassignmentFormComponent,
    FinancialPcasReassignmentConfirmationComponent,
    FinancialPcasAssignmentFormComponent,
    FinancialPcasAssignmentRemoveComponent,
    FinancialPcasAssignmentReportAlertComponent,
    FinancialPcasAssignmentReportPreviewSubmitComponent,
    FinancialPcasObjectFormComponent,
    FinancialPcasObjectDeleteComponent,
    FinancialPcasObjectActivateComponent,
    FinancialPcasObjectDeactivateComponent,
    FinancialPcasGroupDeactivateComponent,
    FinancialPcasGroupActivateComponent,
    FinancialPcasGroupDeleteComponent,
    FinancialPcasGroupFormComponent,
  ],
  exports: [
 
    FinancialPcasAssignmentListComponent,
    FinancialPcasSetupListComponent,
    FinancialPcasReassignmentListComponent,
    FinancialPcasAssignmentReportListComponent,
    FinancialPcasObjectGroupAssignmentComponent,
    FinancialPcasGroupListComponent,
    FinancialPcasObjectListComponent,
    FinancialPcasSetupFormComponent,
    FinancialPcasSetupRemoveComponent,
    FinancialPcasReassignmentFormComponent,
    FinancialPcasReassignmentConfirmationComponent,
    FinancialPcasAssignmentFormComponent,
    FinancialPcasAssignmentRemoveComponent,
    FinancialPcasAssignmentReportAlertComponent,
    FinancialPcasAssignmentReportPreviewSubmitComponent,
    FinancialPcasObjectFormComponent,
    FinancialPcasObjectDeleteComponent,
    FinancialPcasObjectActivateComponent,
    FinancialPcasObjectDeactivateComponent,
    FinancialPcasGroupDeactivateComponent,
    FinancialPcasGroupActivateComponent,
    FinancialPcasGroupDeleteComponent,
    FinancialPcasGroupFormComponent,
  ],
})
export class CaseManagementFeatureFinancialPcasModule {}
