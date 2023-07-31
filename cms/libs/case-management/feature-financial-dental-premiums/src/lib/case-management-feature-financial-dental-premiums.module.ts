import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialDentalPremiumsRoutingModule } from './case-management-feature-financial-dental-premiums.routing.module';
import { DentalPremiumsProcessListComponent } from './components/dental-premiums-process-list/dental-premiums-process-list.component';
import { DentalPremiumsBatchesListComponent } from './components/dental-premiums-batches-list/dental-premiums-batches-list.component';
import { DentalPremiumsAllPaymentsListComponent } from './components/dental-premiums-all-payments-list/dental-premiums-all-payments-list.component';
import { DentalPremiumsBatchPremiumsComponent } from './components/dental-premiums-batch-premiums/dental-premiums-batch-premiums.component';
import { DentalPremiumsBatchListDetailItemsComponent } from './components/dental-premiums-batch-list-detail-items/dental-premiums-batch-list-detail-items.component';
import { DentalPremiumsRemovePremiumsComponent } from './components/dental-premiums-remove-premiums/dental-premiums-remove-premiums.component';
import { DentalPremiumsEditDetailFormComponent } from './components/dental-premiums-edit-detail-form/dental-premiums-edit-detail-form.component';
import { DentalPremiumsPaymentDetailsFormComponent } from './components/dental-premiums-payment-details-form/dental-premiums-payment-details-form.component';
import { DentalPremiumsPreviewPaymentRequestComponent } from './components/dental-premiums-preview-payment-request/dental-premiums-preview-payment-request.component';
import { DentalPremiumsPrintAuthorizationComponent } from './components/dental-premiums-print-authorization/dental-premiums-print-authorization.component';
import { DentalPremiumsProviderInfoComponent } from './components/dental-premiums-provider-info/dental-premiums-provider-info.component';
import { DentalPremiumsRecentPremiumsListComponent } from './components/dental-premiums-recent-premiums-list/dental-premiums-recent-premiums-list.component';
import { DentalPremiumsUnbatchComponent } from './components/dental-premiums-unbatch/dental-premiums-unbatch.component';
import { DentalPremiumsBatchesLogListsComponent } from './components/dental-premiums-batches-log-lists/dental-premiums-batches-log-lists.component';
import { DentalPremiumsBatchPageComponent } from './containers/dental-premiums-batch-page/dental-premiums-batch-page.component';
import { DentalPremiumsBatchesReconcilePaymentsComponent } from './components/dental-premiums-batches-reconcile-payments/dental-premiums-batches-reconcile-payments.component';
import { DentalPremiumsBatchItemsPageComponent } from './containers/dental-premiums-batch-items-page/dental-premiums-batch-items-page.component';
import { DentalPremiumsReconcilePageComponent } from './containers/dental-premiums-reconcile-page/dental-premiums-reconcile-page.component';
import { DentalPremiumsBatchRouterPageComponent } from './containers/dental-premiums-batch-router-page/dental-premiums-router-batch-page.component';
import { DentalPremiumsPaymentsRouterPageComponent } from './containers/dental-premiums-payments-router-page/dental-premiums-payments-router-page.component';
import { DentalPremiumsBatchesReconcilePaymentsBreakoutComponent } from './components/dental-premiums-batches-reconcile-payments-breakout/dental-premiums-batches-reconcile-payments-breakout.component';
import { DentalPremiumsPrintDenialLetterComponent } from './components/dental-premiums-print-denial-letter/dental-premiums-print-denial-letter.component';
import { DentalPremiumsPageComponent } from './containers/dental-premiums/dental-premiums-page.component';
import { DentalPremiumsAddDetailsFormComponent } from './components/dental-premiums-add-details-form/dental-premiums-add-details-form.component';
import { DentalPremiumsSendReportComponent } from './components/dental-premiums-send-report/dental-premiums-send-report.component';
import { DentalPremiumsDeletePaymentComponent } from './components/dental-premiums-delete-payment/dental-premiums-delete-payment.component';
import { DentalPremiumsLeavePageComponent } from './components/dental-premiums-leave-page/dental-premiums-leave-page.component';
import { DentalPremiumsSendNoticeComponent } from './components/dental-premiums-send-notice/dental-premiums-send-notice.component';
import { DentalPremiumsUnbatchPaymentComponent } from './components/dental-premiums-unbatch-payment/dental-premiums-unbatch-payment.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialDentalPremiumsRoutingModule
  ],
  declarations: [
    DentalPremiumsPageComponent,
    DentalPremiumsProcessListComponent,
    DentalPremiumsBatchesListComponent,
    DentalPremiumsAllPaymentsListComponent,
    DentalPremiumsBatchPremiumsComponent,
    DentalPremiumsBatchListDetailItemsComponent,
    DentalPremiumsRemovePremiumsComponent,
    DentalPremiumsEditDetailFormComponent,
    DentalPremiumsPaymentDetailsFormComponent,
    DentalPremiumsPreviewPaymentRequestComponent,
    DentalPremiumsPrintAuthorizationComponent,
    DentalPremiumsProviderInfoComponent,
    DentalPremiumsRecentPremiumsListComponent,
    DentalPremiumsUnbatchComponent,
    DentalPremiumsBatchesLogListsComponent,
    DentalPremiumsBatchPageComponent,
    DentalPremiumsBatchesReconcilePaymentsComponent,
    DentalPremiumsBatchItemsPageComponent,
    DentalPremiumsReconcilePageComponent,
    DentalPremiumsBatchRouterPageComponent,
    DentalPremiumsPaymentsRouterPageComponent,
    DentalPremiumsBatchesReconcilePaymentsBreakoutComponent,
    DentalPremiumsPrintDenialLetterComponent,
    DentalPremiumsAddDetailsFormComponent,
    DentalPremiumsSendReportComponent,
    DentalPremiumsDeletePaymentComponent,
    DentalPremiumsLeavePageComponent,
    DentalPremiumsSendNoticeComponent,
    DentalPremiumsUnbatchPaymentComponent,
  ],
  exports: [
    DentalPremiumsProcessListComponent,
    DentalPremiumsBatchesListComponent,
    DentalPremiumsAllPaymentsListComponent,
    DentalPremiumsBatchPremiumsComponent,
    DentalPremiumsBatchListDetailItemsComponent,
    DentalPremiumsRemovePremiumsComponent,
    DentalPremiumsEditDetailFormComponent,
    DentalPremiumsPaymentDetailsFormComponent,
    DentalPremiumsPreviewPaymentRequestComponent,
    DentalPremiumsPrintAuthorizationComponent,
    DentalPremiumsProviderInfoComponent,
    DentalPremiumsRecentPremiumsListComponent,
    DentalPremiumsUnbatchComponent,
    DentalPremiumsBatchesLogListsComponent,
    DentalPremiumsBatchPageComponent,
    DentalPremiumsBatchesReconcilePaymentsComponent,
    DentalPremiumsBatchItemsPageComponent,
    DentalPremiumsReconcilePageComponent,
    DentalPremiumsBatchRouterPageComponent,
    DentalPremiumsPaymentsRouterPageComponent,
    DentalPremiumsBatchesReconcilePaymentsBreakoutComponent,
    DentalPremiumsPrintDenialLetterComponent,
    DentalPremiumsSendReportComponent,
    DentalPremiumsDeletePaymentComponent,
    DentalPremiumsLeavePageComponent,
    DentalPremiumsSendNoticeComponent,
    DentalPremiumsUnbatchPaymentComponent,
  ],
})
export class CaseManagementFeatureFinancialDentalPremiumsModule { }
