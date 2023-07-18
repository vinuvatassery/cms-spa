import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';
import { RouterModule } from '@angular/router';
import { MedicalClaimsBatchPageComponent } from './containers/medical-claims-batch-page/medical-claims-batch-page.component';
import { MedicalClaimsBatchItemsPageComponent } from './containers/medical-claims-batch-items-page/medical-claims-batch-items-page.component';
import { MedicalClaimsReconcilePageComponent } from './containers/medical-claims-reconcile-page/medical-claims-reconcile-page.component';
import { MedicalClaimsBatchesLogListsComponent } from './components/medical-claims-batches-log-lists/medical-claims-batches-log-lists.component';
import { MedicalClaimsRouterPageComponent } from './containers/medical-claims-router-page/medical-claims-router-page.component';
const routes = [
  {
    path: '',
    component: FinancialMedicalClaimsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: MedicalClaimsRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: MedicalClaimsBatchesLogListsComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: MedicalClaimsBatchesLogListsComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: MedicalClaimsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: MedicalClaimsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
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
 
