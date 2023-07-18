import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseManagementFeatureFinancialMedicalClaimsRoutingModule } from './case-management-feature-financial-medical-claims.routing.module';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';
import { MedicalClaimsProcessListComponent } from './components/medical-claims-process-list/medical-claims-process-list.component';
import { MedicalClaimsBatchesListComponent } from './components/medical-claims-batches-list/medical-claims-batches-list.component';
import { MedicalClaimsAppPaymentsListComponent } from './components/medical-claims-app-payments-list/medical-claims-app-payments-list.component';
import { MedicalClaimsBatchClaimsComponent } from './components/medical-claims-batch-claims/medical-claims-batch-claims.component';
import { MedicalClaimsBatchListDetailItemsComponent } from './components/medical-claims-batch-list-detail-items/medical-claims-batch-list-detail-items.component';
import { MedicalClaimsDeleteClaimsComponent } from './components/medical-claims-delete-claims/medical-claims-delete-claims.component';
import { MedicalClaimsDetailFormComponent } from './components/medical-claims-detail-form/medical-claims-detail-form.component';
import { MedicalClaimsPaymentDetailsFromComponent } from './components/medical-claims-payment-details-from/medical-claims-payment-details-from.component';
import { MedicalClaimsPreviewPaymentRequestComponent } from './components/medical-claims-preview-payment-request/medical-claims-preview-payment-request.component';
import { MedicalClaimsPrintAuthorizationComponent } from './components/medical-claims-print-authorization/medical-claims-print-authorization.component';
import { MedicalClaimsProviderInfoComponent } from './components/medical-claims-provider-info/medical-claims-provider-info.component';
import { MedicalClaimsRecentClaimsListComponent } from './components/medical-claims-recent-claims-list/medical-claims-recent-claims-list.component';
import { MedicalClaimsUnbatchClaimsComponent } from './components/medical-claims-unbatch-claims/medical-claims-unbatch-claims.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialMedicalClaimsRoutingModule,
  ],
  declarations: [
    FinancialMedicalClaimsPageComponent,
    MedicalClaimsProcessListComponent,
    MedicalClaimsBatchesListComponent,
    MedicalClaimsAppPaymentsListComponent,
    MedicalClaimsBatchClaimsComponent,
    MedicalClaimsBatchListDetailItemsComponent,
    MedicalClaimsDeleteClaimsComponent,
    MedicalClaimsDetailFormComponent,
    MedicalClaimsPaymentDetailsFromComponent,
    MedicalClaimsPreviewPaymentRequestComponent,
    MedicalClaimsPrintAuthorizationComponent,
    MedicalClaimsProviderInfoComponent,
    MedicalClaimsRecentClaimsListComponent,
    MedicalClaimsUnbatchClaimsComponent
  ],
  exports: [
    MedicalClaimsProcessListComponent,
    MedicalClaimsBatchesListComponent,
    MedicalClaimsAppPaymentsListComponent,
    MedicalClaimsBatchClaimsComponent,
    MedicalClaimsBatchListDetailItemsComponent,
    MedicalClaimsDeleteClaimsComponent,
    MedicalClaimsDetailFormComponent,
    MedicalClaimsPaymentDetailsFromComponent,
    MedicalClaimsPreviewPaymentRequestComponent,
    MedicalClaimsPrintAuthorizationComponent,
    MedicalClaimsProviderInfoComponent,
    MedicalClaimsRecentClaimsListComponent,
    MedicalClaimsUnbatchClaimsComponent
  ],
})
export class CaseManagementFeatureFinancialMedicalClaimsModule {}
