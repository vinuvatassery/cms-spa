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

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureFinancialVendorRefundRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    VendorRefundPageComponent,
    RefundProcessListComponent,
    RefundBatchesListComponent, 
    RefundAllPaymentListComponent,
    RefundBatchLogListComponent,
    RefundNewFormDetailsComponent,
    BatchRefundConfirmationComponent,
    DeleteRefundConfirmationComponent,
  ],
})
export class CaseManagementFeatureFinancialVendorRefundModule {}
