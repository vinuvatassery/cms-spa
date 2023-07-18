import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';
import { RouterModule } from '@angular/router';
import { MedicalClaimsBatchesLogListsComponent } from './components/medical-claims-batches-log-lists/medical-claims-batches-log-lists.component';
import { MedicalClaimsBatchListDetailItemsComponent } from './components/medical-claims-batch-list-detail-items/medical-claims-batch-list-detail-items.component';
import { MedicalClaimsBatchesReconcilePaymentsComponent } from './components/medical-claims-batches-reconcile-payments/medical-claims-batches-reconcile-payments.component';
const routes = [
  {
    path: '',
    component: FinancialMedicalClaimsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch/batch_log_list',
    component: MedicalClaimsBatchesLogListsComponent,
  }, 
  {
    path: 'batch/batch_log_list/batch_log_items',
    component: MedicalClaimsBatchListDetailItemsComponent,
  }, 
  {
    path: 'batch/batch_log_list/reconcile_payments',
    component: MedicalClaimsBatchesReconcilePaymentsComponent,
  }, 
  
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class CaseManagementFeatureFinancialMedicalClaimsRoutingModule { }
 
