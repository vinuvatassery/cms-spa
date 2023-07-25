import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { DentalClaimsPageComponent } from './containers/dental-claims/dental-claims-page.component';
import { CaseManagementFeatureFinancialDentalClaimsRoutingModule } from './case-management-feature-financial-dental-claims.module.routing';
import { DentalClaimsProcessListComponent } from './components/dental-claims-process-list/dental-claims-process-list.component';
import { DentalClaimsBatchesListComponent } from './components/dental-claims-batches-list/dental-claims-batches-list.component';
import { DentalClaimsAllPaymentsListComponent } from './components/dental-claims-all-payments-list/dental-claims-all-payments-list.component';
import { DentalClaimsBatchClaimsComponent } from './components/dental-claims-batch-claims/dental-claims-batch-claims.component';
import { DentalClaimsBatchListDetailItemsComponent } from './components/dental-claims-batch-list-detail-items/dental-claims-batch-list-detail-items.component';
import { DentalClaimsDeleteClaimsComponent } from './components/dental-claims-delete-claims/dental-claims-delete-claims.component';
import { DentalClaimsDetailFormComponent } from './components/dental-claims-detail-form/dental-claims-detail-form.component';
import { DentalClaimsPaymentDetailsFormComponent } from './components/dental-claims-payment-details-form/dental-claims-payment-details-form.component';
import { DentalClaimsPreviewPaymentRequestComponent } from './components/dental-claims-preview-payment-request/dental-claims-preview-payment-request.component';
import { DentalClaimsPrintAuthorizationComponent } from './components/dental-claims-print-authorization/dental-claims-print-authorization.component';
import { DentalClaimsProviderInfoComponent } from './components/dental-claims-provider-info/dental-claims-provider-info.component';
import { DentalClaimsRecentClaimsListComponent } from './components/dental-claims-recent-claims-list/dental-claims-recent-claims-list.component';
import { DentalClaimsUnbatchClaimsComponent } from './components/dental-claims-unbatch-claims/dental-claims-unbatch-claims.component';
import { DentalClaimsBatchesLogListsComponent } from './components/dental-claims-batches-log-lists/dental-claims-batches-log-lists.component';
import { DentalClaimsBatchPageComponent } from './containers/dental-claims-batch-page/dental-claims-batch-page.component';
import { DentalClaimsBatchesReconcilePaymentsComponent } from './components/dental-claims-batches-reconcile-payments/dental-claims-batches-reconcile-payments.component';
import { DentalClaimsBatchItemsPageComponent } from './containers/dental-claims-batch-items-page/dental-claims-batch-items-page.component';
import { DentalClaimsReconcilePageComponent } from './containers/dental-claims-reconcile-page/dental-claims-reconcile-page.component';
import { DentalClaimsBatchRouterPageComponent } from './containers/dental-claims-batch-router-page/dental-claims-router-batch-page.component';
import { DentalClaimsPaymentsRouterPageComponent } from './containers/dental-claims-payments-router-page/dental-claims-payments-router-page.component';
import { DentalClaimsBatchesReconcilePaymentsBreakoutComponent } from './components/dental-claims-batches-reconcile-payments-breakout/dental-claims-batches-reconcile-payments-breakout.component';
import { DentalClaimsPrintDenialLetterComponent } from './components/dental-claims-print-denial-letter/dental-claims-print-denial-letter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialDentalClaimsRoutingModule,
  ],
  declarations: [
    DentalClaimsPageComponent,
    DentalClaimsProcessListComponent,
    DentalClaimsBatchesListComponent,
    DentalClaimsAllPaymentsListComponent,
    DentalClaimsBatchClaimsComponent,
    DentalClaimsBatchListDetailItemsComponent,
    DentalClaimsDeleteClaimsComponent,
    DentalClaimsDetailFormComponent,
    DentalClaimsPaymentDetailsFormComponent,
    DentalClaimsPreviewPaymentRequestComponent,
    DentalClaimsPrintAuthorizationComponent,
    DentalClaimsProviderInfoComponent,
    DentalClaimsRecentClaimsListComponent,
    DentalClaimsUnbatchClaimsComponent,
    DentalClaimsBatchesLogListsComponent,
    DentalClaimsBatchPageComponent,
    DentalClaimsBatchesReconcilePaymentsComponent,
    DentalClaimsBatchItemsPageComponent,
    DentalClaimsReconcilePageComponent,
    DentalClaimsBatchRouterPageComponent,
    DentalClaimsPaymentsRouterPageComponent,
    DentalClaimsBatchesReconcilePaymentsBreakoutComponent,
    DentalClaimsPrintDenialLetterComponent,
  ],
  exports: [
    DentalClaimsProcessListComponent,
    DentalClaimsBatchesListComponent,
    DentalClaimsAllPaymentsListComponent,
    DentalClaimsBatchClaimsComponent,
    DentalClaimsBatchListDetailItemsComponent,
    DentalClaimsDeleteClaimsComponent,
    DentalClaimsDetailFormComponent,
    DentalClaimsPaymentDetailsFormComponent,
    DentalClaimsPreviewPaymentRequestComponent,
    DentalClaimsPrintAuthorizationComponent,
    DentalClaimsProviderInfoComponent,
    DentalClaimsRecentClaimsListComponent,
    DentalClaimsUnbatchClaimsComponent,
    DentalClaimsBatchesLogListsComponent,
    DentalClaimsBatchPageComponent,
    DentalClaimsBatchesReconcilePaymentsComponent,
    DentalClaimsBatchItemsPageComponent,
    DentalClaimsReconcilePageComponent,
    DentalClaimsBatchRouterPageComponent,
    DentalClaimsPaymentsRouterPageComponent,
    DentalClaimsBatchesReconcilePaymentsBreakoutComponent,
    DentalClaimsPrintDenialLetterComponent,
  ],
})
export class CaseManagementFeatureFinancialDentalClaimsModule {}
