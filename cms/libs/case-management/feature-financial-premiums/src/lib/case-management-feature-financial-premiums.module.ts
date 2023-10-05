import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

import { FinancialPremiumsProcessListComponent } from './components/financial-premiums-process-list/financial-premiums-process-list.component';
import { FinancialPremiumsBatchesListComponent } from './components/financial-premiums-batches-list/financial-premiums-batches-list.component';
import { FinancialPremiumsAllPaymentsListComponent } from './components/financial-premiums-all-payments-list/financial-premiums-all-payments-list.component';
import { FinancialPremiumsBatchPremiumsComponent } from './components/financial-premiums-batch-premiums/financial-premiums-batch-premiums.component';
import { FinancialPremiumsBatchListDetailItemsComponent } from './components/financial-premiums-batch-list-detail-items/financial-premiums-batch-list-detail-items.component';
import { FinancialPremiumsRemovePremiumsComponent } from './components/financial-premiums-remove-premiums/financial-premiums-remove-premiums.component';
import { FinancialPremiumsEditDetailFormComponent } from './components/financial-premiums-edit-detail-form/financial-premiums-edit-detail-form.component';
import { FinancialPremiumsPaymentDetailsFormComponent } from './components/financial-premiums-payment-details-form/financial-premiums-payment-details-form.component';
import { FinancialPremiumsPreviewPaymentRequestComponent } from './components/financial-premiums-preview-payment-request/financial-premiums-preview-payment-request.component';
import { FinancialPremiumsPrintAuthorizationComponent } from './components/financial-premiums-print-authorization/financial-premiums-print-authorization.component';
import { FinancialPremiumsProviderInfoComponent } from './components/financial-premiums-provider-info/financial-premiums-provider-info.component';
import { FinancialPremiumsRecentPremiumsListComponent } from './components/financial-premiums-recent-premiums-list/financial-premiums-recent-premiums-list.component';
import { FinancialPremiumsUnbatchComponent } from './components/financial-premiums-unbatch/financial-premiums-unbatch.component';
import { FinancialPremiumsBatchesLogListsComponent } from './components/financial-premiums-batches-log-lists/financial-premiums-batches-log-lists.component';
import { FinancialPremiumsBatchPageComponent } from './containers/financial-premiums-batch-page/financial-premiums-batch-page.component';
import { FinancialPremiumsBatchesReconcilePaymentsComponent } from './components/financial-premiums-batches-reconcile-payments/financial-premiums-batches-reconcile-payments.component';
import { FinancialPremiumsBatchItemsPageComponent } from './containers/financial-premiums-batch-items-page/financial-premiums-batch-items-page.component';
import { FinancialPremiumsReconcilePageComponent } from './containers/financial-premiums-reconcile-page/financial-premiums-reconcile-page.component';
import { FinancialPremiumsBatchRouterPageComponent } from './containers/financial-premiums-batch-router-page/financial-premiums-router-batch-page.component';
import { FinancialPremiumsPaymentsRouterPageComponent } from './containers/financial-premiums-payments-router-page/financial-premiums-payments-router-page.component';
import { FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent } from './components/financial-premiums-batches-reconcile-payments-breakout/financial-premiums-batches-reconcile-payments-breakout.component';
import { FinancialPremiumsPrintDenialLetterComponent } from './components/financial-premiums-print-denial-letter/financial-premiums-print-denial-letter.component';

import { CaseManagementFeatureFinancialPremiumsRoutingModule } from './case-management-feature-financial-premiums.routing.module';
import { FinancialPremiumsPageComponent } from './containers/financial-premiums/financial-premiums-page.component';
import { FinancialPremiumsAddDetailsFormComponent } from './components/financial-premiums-add-details-form/financial-premiums-add-details-form.component';
import { FinancialPremiumsSendReportComponent } from './components/financial-premiums-send-report/financial-premiums-send-report.component';
import { FinancialPremiumsDeletePaymentComponent } from './components/financial-premiums-delete-payment/financial-premiums-delete-payment.component';
import { FinancialPremiumsLeavePageComponent } from './components/financial-premiums-leave-page/financial-premiums-leave-page.component';
import { FinancialPremiumsSendNoticeComponent } from './components/financial-premiums-send-notice/financial-premiums-send-notice.component';
import { FinancialPremiumsUnbatchPaymentComponent } from './components/financial-premiums-unbatch-payment/financial-premiums-unbatch-payment.component';
import { FinancialPremiumsBatchesLogInvoiceListsComponent } from './components/financial-premiums-batches-log-invoices-lists/financial-premiums-batches-log-invoices-lists.component';
import { CaseManagementFeatureFinancialClaimsModule } from '@cms/case-management/feature-financial-claims';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialPremiumsRoutingModule,
    CaseManagementFeatureFinancialClaimsModule
  ],
  declarations: [
    FinancialPremiumsPageComponent,
    FinancialPremiumsProcessListComponent,
    FinancialPremiumsBatchesListComponent,
    FinancialPremiumsAllPaymentsListComponent,
    FinancialPremiumsBatchPremiumsComponent,
    FinancialPremiumsBatchListDetailItemsComponent,
    FinancialPremiumsRemovePremiumsComponent,
    FinancialPremiumsEditDetailFormComponent,
    FinancialPremiumsPaymentDetailsFormComponent,
    FinancialPremiumsPreviewPaymentRequestComponent,
    FinancialPremiumsPrintAuthorizationComponent,
    FinancialPremiumsProviderInfoComponent,
    FinancialPremiumsRecentPremiumsListComponent,
    FinancialPremiumsUnbatchComponent,
    FinancialPremiumsBatchesLogListsComponent,
    FinancialPremiumsBatchPageComponent,
    FinancialPremiumsBatchesReconcilePaymentsComponent,
    FinancialPremiumsBatchItemsPageComponent,
    FinancialPremiumsReconcilePageComponent,
    FinancialPremiumsBatchRouterPageComponent,
    FinancialPremiumsPaymentsRouterPageComponent,
    FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent,
    FinancialPremiumsPrintDenialLetterComponent,
    FinancialPremiumsAddDetailsFormComponent,
    FinancialPremiumsSendReportComponent,
    FinancialPremiumsDeletePaymentComponent,
    FinancialPremiumsLeavePageComponent,
    FinancialPremiumsSendNoticeComponent,
    FinancialPremiumsUnbatchPaymentComponent,
    FinancialPremiumsBatchesLogInvoiceListsComponent
  ],
  exports: [
    FinancialPremiumsProcessListComponent,
    FinancialPremiumsBatchesListComponent,
    FinancialPremiumsAllPaymentsListComponent,
    FinancialPremiumsBatchPremiumsComponent,
    FinancialPremiumsBatchListDetailItemsComponent,
    FinancialPremiumsRemovePremiumsComponent,
    FinancialPremiumsEditDetailFormComponent,
    FinancialPremiumsPaymentDetailsFormComponent,
    FinancialPremiumsPreviewPaymentRequestComponent,
    FinancialPremiumsPrintAuthorizationComponent,
    FinancialPremiumsProviderInfoComponent,
    FinancialPremiumsRecentPremiumsListComponent,
    FinancialPremiumsUnbatchComponent,
    FinancialPremiumsBatchesLogListsComponent,
    FinancialPremiumsBatchPageComponent,
    FinancialPremiumsBatchesReconcilePaymentsComponent,
    FinancialPremiumsBatchItemsPageComponent,
    FinancialPremiumsReconcilePageComponent,
    FinancialPremiumsBatchRouterPageComponent,
    FinancialPremiumsPaymentsRouterPageComponent,
    FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent,
    FinancialPremiumsPrintDenialLetterComponent,
    FinancialPremiumsSendReportComponent,
    FinancialPremiumsDeletePaymentComponent,
    FinancialPremiumsLeavePageComponent,
    FinancialPremiumsSendNoticeComponent,
    FinancialPremiumsUnbatchPaymentComponent,
    FinancialPremiumsBatchesLogInvoiceListsComponent
  ],
})
export class CaseManagementFeatureFinancialPremiumsModule {}

 
