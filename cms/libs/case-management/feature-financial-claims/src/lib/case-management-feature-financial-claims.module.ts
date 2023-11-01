import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialClaimsRoutingModule } from './case-management-feature-financial-claims.routing.module';
import { FinancialClaimsPageComponent } from './containers/financial-claims-page/financial-claims-page.component';
import { FinancialClaimsProcessListComponent } from './components/financial-claims-process-list/financial-claims-process-list.component';
import { FinancialClaimsBatchesListComponent } from './components/financial-claims-batches-list/financial-claims-batches-list.component';
import { FinancialClaimsAllPaymentsListComponent } from './components/financial-claims-all-payments-list/financial-claims-all-payments-list.component';
import { FinancialClaimsBatchClaimsComponent } from './components/financial-claims-batch-claims/financial-claims-batch-claims.component';
import { FinancialClaimsBatchListDetailItemsComponent } from './components/financial-claims-batch-list-detail-items/financial-claims-batch-list-detail-items.component';
import { FinancialClaimsDeleteClaimsComponent } from './components/financial-claims-delete-claims/financial-claims-delete-claims.component';
import { FinancialClaimsDetailFormComponent } from './components/financial-claims-detail-form/financial-claims-detail-form.component';
import { FinancialClaimsPaymentDetailsFormComponent } from './components/financial-claims-payment-details-form/financial-claims-payment-details-form.component';
import { FinancialClaimsPreviewPaymentRequestComponent } from './components/financial-claims-preview-payment-request/financial-claims-preview-payment-request.component';
import { FinancialClaimsPrintAuthorizationComponent } from './components/financial-claims-print-authorization/financial-claims-print-authorization.component';
import { FinancialClaimsProviderInfoComponent } from './components/financial-claims-provider-info/financial-claims-provider-info.component';
import { FinancialClaimsRecentClaimsListComponent } from './components/financial-claims-recent-claims-list/financial-claims-recent-claims-list.component';
import { FinancialClaimsUnbatchClaimsComponent } from './components/financial-claims-unbatch-claims/financial-claims-unbatch-claims.component';
import { FinancialClaimsBatchesLogListsComponent } from './components/financial-claims-batches-log-lists/financial-claims-batches-log-lists.component';
import { FinancialClaimsBatchPageComponent } from './containers/financial-claims-batch-page/financial-claims-batch-page.component';
import { FinancialClaimsBatchesReconcilePaymentsComponent } from './components/financial-claims-batches-reconcile-payments/financial-claims-batches-reconcile-payments.component';
import { FinancialClaimsBatchItemsPageComponent } from './containers/financial-claims-batch-items-page/financial-claims-batch-items-page.component';
import { FinancialClaimsReconcilePageComponent } from './containers/financial-claims-reconcile-page/financial-claims-reconcile-page.component';
import { FinancialClaimsBatchRouterPageComponent } from './containers/financial-claims-batch-router-page/financial-claims-router-batch-page.component';
import { FinancialClaimsPaymentsRouterPageComponent } from './containers/financial-claims-payments-router-page/financial-claims-payments-router-page.component';
import { FinancialClaimsBatchesReconcilePaymentsBreakoutComponent } from './components/financial-claims-batches-reconcile-payments-breakout/financial-claims-batches-reconcile-payments-breakout.component';
import { FinancialClaimsPrintDenialLetterComponent } from './components/financial-claims-print-denial-letter/financial-claims-print-denial-letter.component';
import { FinancialClaimsInvoiceListComponent } from './components/financial-claims-invoice-list/financial-claims-invoice-list.component';
import { FinancialClaimsPaymentServiceListComponent } from './components/financial-claims-payment-service-list/financial-claims-payment-service-list.component';
import { FinancialPcaChosenAlertComponent } from './components/financial-pca-chosen-alert/financial-pca-chosen-alert.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialClaimsRoutingModule,
  ],
  declarations: [
    FinancialClaimsPageComponent,
    FinancialClaimsProcessListComponent,
    FinancialClaimsBatchesListComponent,
    FinancialClaimsAllPaymentsListComponent,
    FinancialClaimsBatchClaimsComponent,
    FinancialClaimsBatchListDetailItemsComponent,
    FinancialClaimsDeleteClaimsComponent,
    FinancialClaimsDetailFormComponent,
    FinancialClaimsPaymentDetailsFormComponent,
    FinancialClaimsPreviewPaymentRequestComponent,
    FinancialClaimsPrintAuthorizationComponent,
    FinancialClaimsProviderInfoComponent,
    FinancialClaimsRecentClaimsListComponent,
    FinancialClaimsUnbatchClaimsComponent,
    FinancialClaimsBatchesLogListsComponent,
    FinancialClaimsBatchPageComponent,
    FinancialClaimsBatchesReconcilePaymentsComponent,
    FinancialClaimsBatchItemsPageComponent,
    FinancialClaimsReconcilePageComponent,
    FinancialClaimsBatchRouterPageComponent,
    FinancialClaimsPaymentsRouterPageComponent,
    FinancialClaimsBatchesReconcilePaymentsBreakoutComponent,
    FinancialClaimsPrintDenialLetterComponent,
    FinancialClaimsInvoiceListComponent,
    FinancialClaimsPaymentServiceListComponent,
    FinancialPcaChosenAlertComponent
  ],
  exports: [
    FinancialClaimsPageComponent,
    FinancialClaimsProcessListComponent,
    FinancialClaimsBatchesListComponent,
    FinancialClaimsAllPaymentsListComponent,
    FinancialClaimsBatchClaimsComponent,
    FinancialClaimsBatchListDetailItemsComponent,
    FinancialClaimsDeleteClaimsComponent,
    FinancialClaimsDetailFormComponent,
    FinancialClaimsPaymentDetailsFormComponent,
    FinancialClaimsPreviewPaymentRequestComponent,
    FinancialClaimsPrintAuthorizationComponent,
    FinancialClaimsProviderInfoComponent,
    FinancialClaimsRecentClaimsListComponent,
    FinancialClaimsUnbatchClaimsComponent,
    FinancialClaimsBatchesLogListsComponent,
    FinancialClaimsBatchPageComponent,
    FinancialClaimsBatchesReconcilePaymentsComponent,
    FinancialClaimsBatchItemsPageComponent,
    FinancialClaimsReconcilePageComponent,
    FinancialClaimsBatchRouterPageComponent,
    FinancialClaimsPaymentsRouterPageComponent,
    FinancialClaimsBatchesReconcilePaymentsBreakoutComponent,
    FinancialClaimsPrintDenialLetterComponent,
    FinancialClaimsInvoiceListComponent,
    FinancialClaimsPaymentServiceListComponent,
    FinancialPcaChosenAlertComponent
  ],
})
export class CaseManagementFeatureFinancialClaimsModule {}
