import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

import { MedicalPremiumsProcessListComponent } from './components/medical-premiums-process-list/medical-premiums-process-list.component';
import { MedicalPremiumsBatchesListComponent } from './components/medical-premiums-batches-list/medical-premiums-batches-list.component';
import { MedicalPremiumsAllPaymentsListComponent } from './components/medical-premiums-all-payments-list/medical-premiums-all-payments-list.component';
import { MedicalPremiumsBatchPremiumsComponent } from './components/medical-premiums-batch-premiums/medical-premiums-batch-premiums.component';
import { MedicalPremiumsBatchListDetailItemsComponent } from './components/medical-premiums-batch-list-detail-items/medical-premiums-batch-list-detail-items.component';
import { MedicalPremiumsDeletePremiumsComponent } from './components/medical-premiums-delete-premiums/medical-premiums-delete-premiums.component';
import { MedicalPremiumsDetailFormComponent } from './components/medical-premiums-detail-form/medical-premiums-detail-form.component';
import { MedicalPremiumsPaymentDetailsFormComponent } from './components/medical-premiums-payment-details-form/medical-premiums-payment-details-form.component';
import { MedicalPremiumsPreviewPaymentRequestComponent } from './components/medical-premiums-preview-payment-request/medical-premiums-preview-payment-request.component';
import { MedicalPremiumsPrintAuthorizationComponent } from './components/medical-premiums-print-authorization/medical-premiums-print-authorization.component';
import { MedicalPremiumsProviderInfoComponent } from './components/medical-premiums-provider-info/medical-premiums-provider-info.component';
import { MedicalPremiumsRecentPremiumsListComponent } from './components/medical-premiums-recent-premiums-list/medical-premiums-recent-premiums-list.component';
import { MedicalPremiumsUnbatchComponent } from './components/medical-premiums-unbatch/medical-premiums-unbatch.component';
import { MedicalPremiumsBatchesLogListsComponent } from './components/medical-premiums-batches-log-lists/medical-premiums-batches-log-lists.component';
import { MedicalPremiumsBatchPageComponent } from './containers/medical-premiums-batch-page/medical-premiums-batch-page.component';
import { MedicalPremiumsBatchesReconcilePaymentsComponent } from './components/medical-premiums-batches-reconcile-payments/medical-premiums-batches-reconcile-payments.component';
import { MedicalPremiumsBatchItemsPageComponent } from './containers/medical-premiums-batch-items-page/medical-premiums-batch-items-page.component';
import { MedicalPremiumsReconcilePageComponent } from './containers/medical-premiums-reconcile-page/medical-premiums-reconcile-page.component';
import { MedicalPremiumsBatchRouterPageComponent } from './containers/medical-premiums-batch-router-page/medical-premiums-router-batch-page.component';
import { MedicalPremiumsPaymentsRouterPageComponent } from './containers/medical-premiums-payments-router-page/medical-premiums-payments-router-page.component';
import { MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent } from './components/medical-premiums-batches-reconcile-payments-breakout/medical-premiums-batches-reconcile-payments-breakout.component';
import { MedicalPremiumsPrintDenialLetterComponent } from './components/medical-premiums-print-denial-letter/medical-premiums-print-denial-letter.component';

import { CaseManagementFeatureFinancialInsurancePremiumsRoutingModule } from './case-management-feature-financial-insurance-premiums.routing.module';
import { MedicalPremiumsPageComponent } from './containers/medical-premiums/medical-premiums-page.component';
import { MedicalPremiumsAddDetailsFormComponent } from './components/medical-premiums-add-details-form/medical-premiums-add-details-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
    CaseManagementFeatureFinancialInsurancePremiumsRoutingModule,
  ],
  declarations: [
    MedicalPremiumsPageComponent,
    MedicalPremiumsProcessListComponent,
    MedicalPremiumsBatchesListComponent,
    MedicalPremiumsAllPaymentsListComponent,
    MedicalPremiumsBatchPremiumsComponent,
    MedicalPremiumsBatchListDetailItemsComponent,
    MedicalPremiumsDeletePremiumsComponent,
    MedicalPremiumsDetailFormComponent,
    MedicalPremiumsPaymentDetailsFormComponent,
    MedicalPremiumsPreviewPaymentRequestComponent,
    MedicalPremiumsPrintAuthorizationComponent,
    MedicalPremiumsProviderInfoComponent,
    MedicalPremiumsRecentPremiumsListComponent,
    MedicalPremiumsUnbatchComponent,
    MedicalPremiumsBatchesLogListsComponent,
    MedicalPremiumsBatchPageComponent,
    MedicalPremiumsBatchesReconcilePaymentsComponent,
    MedicalPremiumsBatchItemsPageComponent,
    MedicalPremiumsReconcilePageComponent,
    MedicalPremiumsBatchRouterPageComponent,
    MedicalPremiumsPaymentsRouterPageComponent,
    MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent,
    MedicalPremiumsPrintDenialLetterComponent,
    MedicalPremiumsAddDetailsFormComponent,
  ],
  exports: [
    MedicalPremiumsProcessListComponent,
    MedicalPremiumsBatchesListComponent,
    MedicalPremiumsAllPaymentsListComponent,
    MedicalPremiumsBatchPremiumsComponent,
    MedicalPremiumsBatchListDetailItemsComponent,
    MedicalPremiumsDeletePremiumsComponent,
    MedicalPremiumsDetailFormComponent,
    MedicalPremiumsPaymentDetailsFormComponent,
    MedicalPremiumsPreviewPaymentRequestComponent,
    MedicalPremiumsPrintAuthorizationComponent,
    MedicalPremiumsProviderInfoComponent,
    MedicalPremiumsRecentPremiumsListComponent,
    MedicalPremiumsUnbatchComponent,
    MedicalPremiumsBatchesLogListsComponent,
    MedicalPremiumsBatchPageComponent,
    MedicalPremiumsBatchesReconcilePaymentsComponent,
    MedicalPremiumsBatchItemsPageComponent,
    MedicalPremiumsReconcilePageComponent,
    MedicalPremiumsBatchRouterPageComponent,
    MedicalPremiumsPaymentsRouterPageComponent,
    MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent,
    MedicalPremiumsPrintDenialLetterComponent,
  ],
})
export class CaseManagementFeatureFinancialInsurancePremiumsModule {}
