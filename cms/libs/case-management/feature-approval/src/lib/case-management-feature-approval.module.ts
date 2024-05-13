/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementFeatureApprovalRoutingModule } from './case-management-feature-approval-routing.module';
import { CaseManagementFeatureFinancialClaimsModule } from '@cms/case-management/feature-financial-claims';
/** Components **/
import { ApprovalPageComponent } from './containers/approval-page/approval-page.component';
import { ApprovalsGeneralListComponent } from './components/approvals-general-list/approvals-general-list.component';
import { ApprovalsPaymentsListComponent } from './components/approvals-payments-list/approvals-payments-list.component';
import { DepositDetailsComponent } from './components/deposit-details/deposit-details.component';
import { ApprovalBatchListsComponent } from './components/approval-batch-lists/approval-batch-lists.component';
import { ApprovalInvoiceComponent } from './components/approval-invoice/approval-invoice.component';
import { ImportedClaimsListsComponent } from './components/imported-claims-lists/imported-claims-lists.component';
import { ApprovalsSearchClientsComponent } from './components/approvals-search-clients/approvals-search-clients.component';
import { ApprovalsReviewPossibleMatchesComponent } from './components/approvals-review-possible-matches/approvals-review-possible-matches.component';
import { ApprovalsEditItemsComponent } from './components/approvals-edit-items/approvals-edit-items.component';
import { ApprovalsExpectationReasonComponent } from './components/approvals-expectation-reason/approvals-expectation-reason.component';
import { ApprovalsGeneralListDetailCaseReassignmentComponent } from './components/approvals-general-list-detail-casereassignment/approvals-general-list-detail-casereassignment.component';
import { ApprovalsGeneralListDetailExceptionsComponent } from './components/approvals-general-list-detail-exceptions/approvals-general-list-detail-exceptions.component';
import { ApprovalsGeneralListDetailAddtomasterlistComponent } from './components/approvals-general-list-detail-addtomasterlist/approvals-general-list-detail-addtomasterlist.component';
import { HivVerificationListComponent } from './components/hiv-verification-list/hiv-verification-list.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    CaseManagementFeatureApprovalRoutingModule,
    CaseManagementFeatureFinancialClaimsModule,
  ],
  declarations: [
    ApprovalPageComponent,
    ApprovalsGeneralListComponent,
    ApprovalsPaymentsListComponent,
    DepositDetailsComponent,
    ApprovalBatchListsComponent,
    ApprovalInvoiceComponent,
    ImportedClaimsListsComponent,
    ApprovalsSearchClientsComponent,
    ApprovalsReviewPossibleMatchesComponent,
    ApprovalsEditItemsComponent,
    ApprovalsExpectationReasonComponent,
    ApprovalsGeneralListDetailCaseReassignmentComponent,
    ApprovalsGeneralListDetailExceptionsComponent,
    ApprovalsGeneralListDetailAddtomasterlistComponent,
    HivVerificationListComponent,
  ],
  exports: [
    ApprovalPageComponent
  ],
})
export class CaseManagementFeatureApprovalModule {}
