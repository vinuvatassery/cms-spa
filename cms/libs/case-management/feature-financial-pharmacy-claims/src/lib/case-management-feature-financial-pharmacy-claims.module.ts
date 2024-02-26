import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialPharmacyClaimsRoutingModule } from './case-management-feature-financial-pharmacy-claims.routing.module';
import { PharmacyClaimsPageComponent } from './containers/pharmacy-claims/pharmacy-claims-page.component';
import { PharmacyClaimsBatchClaimsComponent } from './components/pharmacy-claims-batch-claims/pharmacy-claims-batch-claims.component';
import { PharmacyClaimsBatchListDetailItemsComponent } from './components/pharmacy-claims-batch-list-detail-items/pharmacy-claims-batch-list-detail-items.component';
import { PharmacyClaimsBatchesListComponent } from './components/pharmacy-claims-batches-list/pharmacy-claims-batches-list.component';
import { PharmacyClaimsBatchesLogListsComponent } from './components/pharmacy-claims-batches-log-lists/pharmacy-claims-batches-log-lists.component';
import { PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent } from './components/pharmacy-claims-batches-reconcile-payments-breakout/pharmacy-claims-batches-reconcile-payments-breakout.component';
import { PharmacyClaimsBatchesReconcilePaymentsComponent } from './components/pharmacy-claims-batches-reconcile-payments/pharmacy-claims-batches-reconcile-payments.component';
import { PharmacyClaimsDeleteClaimsComponent } from './components/pharmacy-claims-delete-claims/pharmacy-claims-delete-claims.component';
import { PharmacyClaimsPaymentDetailsFormComponent } from './components/pharmacy-claims-payment-details-form/pharmacy-claims-payment-details-form.component';
import { PharmacyClaimsPreviewPaymentRequestComponent } from './components/pharmacy-claims-preview-payment-request/pharmacy-claims-preview-payment-request.component';
import { PharmacyClaimsPrintAuthorizationComponent } from './components/pharmacy-claims-print-authorization/pharmacy-claims-print-authorization.component';
import { PharmacyClaimsPrintDenialLetterComponent } from './components/pharmacy-claims-print-denial-letter/pharmacy-claims-print-denial-letter.component';
import { PharmacyClaimsProcessListComponent } from './components/pharmacy-claims-process-list/pharmacy-claims-process-list.component';
import { PharmacyClaimsProviderInfoComponent } from './components/pharmacy-claims-provider-info/pharmacy-claims-provider-info.component';
import { PharmacyClaimsUnbatchClaimsComponent } from './components/pharmacy-claims-unbatch-claims/pharmacy-claims-unbatch-claims.component';
import { PharmacyClaimsBatchPageComponent } from './containers/pharmacy-claims-batch-page/pharmacy-claims-batch-page.component';
import { PharmacyClaimsBatchRouterPageComponent } from './containers/pharmacy-claims-batch-router-page/pharmacy-claims-router-batch-page.component';
import { PharmacyClaimsPaymentsRouterPageComponent } from './containers/pharmacy-claims-payments-router-page/pharmacy-claims-payments-router-page.component';
import { PharmacyClaimsReconcilePageComponent } from './containers/pharmacy-claims-reconcile-page/pharmacy-claims-reconcile-page.component';
import { PharmacyClaimsAllPaymentsListComponent } from './components/pharmacy-claims-all-payments-list/pharmacy-claims-all-payments-list.component';
import { PharmacyClaimsBatchItemsPageComponent } from './containers/pharmacy-claims-batch-items-page/pharmacy-claims-batch-items-page.component';
import { PharmacyClaimsReverseClaimsComponent } from './components/pharmacy-claims-reverse-claims/pharmacy-claims-reverse-claims.component';
import { PharmacyClaimsPrescriptionListComponent } from './components/pharmacy-claims-prescription-list/pharmacy-claims-prescription-list.component';
import { PharmacyClaimsPrescriptionsServicesComponent } from './components/pharmacy-claims-prescriptions-services/pharmacy-claims-prescriptions-services.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialPharmacyClaimsRoutingModule,
  ],
  declarations: [
    PharmacyClaimsPageComponent,
    PharmacyClaimsAllPaymentsListComponent,
    PharmacyClaimsProcessListComponent,
    PharmacyClaimsBatchesListComponent,
    PharmacyClaimsBatchesListComponent,
    PharmacyClaimsBatchClaimsComponent,
    PharmacyClaimsBatchListDetailItemsComponent,
    PharmacyClaimsDeleteClaimsComponent,
    PharmacyClaimsPaymentDetailsFormComponent,
    PharmacyClaimsPreviewPaymentRequestComponent,
    PharmacyClaimsPrintAuthorizationComponent,
    PharmacyClaimsProviderInfoComponent,
    PharmacyClaimsUnbatchClaimsComponent,
    PharmacyClaimsBatchesLogListsComponent,
    PharmacyClaimsBatchPageComponent,
    PharmacyClaimsBatchesReconcilePaymentsComponent,
    PharmacyClaimsBatchPageComponent,
    PharmacyClaimsReconcilePageComponent,
    PharmacyClaimsBatchRouterPageComponent,
    PharmacyClaimsPaymentsRouterPageComponent,
    PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent,
    PharmacyClaimsPrintDenialLetterComponent,
    PharmacyClaimsBatchItemsPageComponent,
    PharmacyClaimsReverseClaimsComponent,
    PharmacyClaimsPrescriptionListComponent,
    PharmacyClaimsPrescriptionsServicesComponent,
  ],
  exports: [
    PharmacyClaimsProcessListComponent,
    PharmacyClaimsBatchesListComponent,
    PharmacyClaimsBatchesListComponent,
    PharmacyClaimsBatchClaimsComponent,
    PharmacyClaimsBatchListDetailItemsComponent,
    PharmacyClaimsDeleteClaimsComponent,
    PharmacyClaimsPaymentDetailsFormComponent,
    PharmacyClaimsPreviewPaymentRequestComponent,
    PharmacyClaimsPrintAuthorizationComponent,
    PharmacyClaimsProviderInfoComponent,
    PharmacyClaimsUnbatchClaimsComponent,
    PharmacyClaimsBatchesLogListsComponent,
    PharmacyClaimsBatchPageComponent,
    PharmacyClaimsBatchesReconcilePaymentsComponent,
    PharmacyClaimsBatchPageComponent,
    PharmacyClaimsReconcilePageComponent,
    PharmacyClaimsBatchRouterPageComponent,
    PharmacyClaimsPaymentsRouterPageComponent,
    PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent,
    PharmacyClaimsPrintDenialLetterComponent,
    PharmacyClaimsBatchItemsPageComponent,
    PharmacyClaimsReverseClaimsComponent,
    PharmacyClaimsPrescriptionListComponent,
  ],
})
export class CaseManagementFeatureFinancialPharmacyClaimsModule {}
