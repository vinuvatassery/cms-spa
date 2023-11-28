import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { VendorRefundPageComponent } from './containers/vendor-refund-page/vendor-refund-page.component';
import { CaseManagementFeatureFinancialVendorRefundRoutingModule } from './case-management-feature-financial-vendor-refund.routing.module';
import { RefundProcessListComponent } from './components/refund-process-list/refund-process-list.component';
import { RefundBatchesListComponent } from './components/refund-batches-list/refund-batches-list.component';
import { RefundAllPaymentListComponent } from './components/refund-all-payment-list/refund-all-payment-list.component';
import { RefundBatchLogListComponent } from './components/refund-batch-log-list/refund-batch-log-list.component';
import { RefundNewFormDetailsComponent } from './components/refund-new-form-details/refund-new-form-details.component';
import { BatchRefundConfirmationComponent } from './components/batch-refund-confirmation/batch-refund-confirmation.component';
import { DeleteRefundConfirmationComponent } from './components/delete-refund-confirmation/delete-refund-confirmation.component';
import { VendorRefundClaimsListComponent } from './components/vendor-refund-claims-list/vendor-refund-claims-list.component';
import { VendorRefundClientClaimsListComponent } from './components/vendor-refund-client-claims-list/vendor-refund-client-claims-list.component';
import { VendorRefundInsurancePremiumListComponent } from './components/vendor-refund-insurance-premium-list/vendor-refund-insurance-premium-list.component';
import { VendorRefundSelectedPremiumListComponent } from './components/vendor-refund-selected-premium-list/vendor-refund-selected-premium-list.component';
import { RefundBatchPageComponent } from './containers/refund-batch-page/refund-batch-page.component';
import { VendorRefundPharmacyPaymentsListComponent } from './components/vendor-refund-pharmacy-payments-list/vendor-refund-pharmacy-payments-list.component';
import { CaseManagementFeatureFinancialPremiumsModule } from '@cms/case-management/feature-financial-premiums';
import { UnbatchRefundConfirmationComponent } from './components/unbatch-refund-confirmation/unbatch-refund-confirmation.component';
import { filterResetConfirmationComponent } from './components/reset-filter-confirmation/reset-filter-confirmation.component';
import { VednorRefundTpaClaimsListComponent } from './components/vednor-refund-tpa-claims-list/vednor-refund-tpa-claims-list.component';
import { VednorRefundTpaSelectedClaimsListComponent } from './components/vednor-refund-tpa-selected-claims-list/vednor-refund-tpa-selected-claims-list.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureFinancialVendorRefundRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialPremiumsModule,
  ],
  declarations: [
    VendorRefundPageComponent,
    RefundProcessListComponent,
    RefundBatchesListComponent,
    RefundAllPaymentListComponent,
    RefundBatchLogListComponent,
    RefundNewFormDetailsComponent,
    BatchRefundConfirmationComponent,
    UnbatchRefundConfirmationComponent,
    DeleteRefundConfirmationComponent,
    VendorRefundClaimsListComponent,
    VendorRefundInsurancePremiumListComponent,
    RefundBatchPageComponent,
    VendorRefundSelectedPremiumListComponent,
    VendorRefundClientClaimsListComponent,
    VendorRefundPharmacyPaymentsListComponent,
    filterResetConfirmationComponent,
    VednorRefundTpaClaimsListComponent,
    VednorRefundTpaSelectedClaimsListComponent,
  ],
})
export class CaseManagementFeatureFinancialVendorRefundModule {}
