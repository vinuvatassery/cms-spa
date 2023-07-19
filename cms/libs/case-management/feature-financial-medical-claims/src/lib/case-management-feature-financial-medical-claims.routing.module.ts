import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialMedicalClaimsPageComponent } from './containers/medical-claims-page/medical-claims-page.component';
import { RouterModule } from '@angular/router';
import { MedicalClaimsBatchPageComponent } from './containers/medical-claims-batch-page/medical-claims-batch-page.component';
import { MedicalClaimsBatchItemsPageComponent } from './containers/medical-claims-batch-items-page/medical-claims-batch-items-page.component';
import { MedicalClaimsReconcilePageComponent } from './containers/medical-claims-reconcile-page/medical-claims-reconcile-page.component';
import { MedicalClaimsBatchRouterPageComponent } from './containers/medical-claims-batch-router-page/medical-claims-router-batch-page.component';
import { MedicalClaimsPaymentsRouterPageComponent } from './containers/medical-claims-payments-router-page/medical-claims-payments-router-page.component';
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
    component: MedicalClaimsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: MedicalClaimsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: MedicalClaimsBatchPageComponent,
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
  {
    path: 'payments',
    component: MedicalClaimsPaymentsRouterPageComponent,
    data: {
      title: 'Payments',
    },
    children: [       
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
 
