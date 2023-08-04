import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PharmacyClaimsPageComponent } from './containers/pharmacy-claims/pharmacy-claims-page.component';
import { PharmacyClaimsBatchPageComponent } from './containers/pharmacy-claims-batch-page/pharmacy-claims-batch-page.component';
import { PharmacyClaimsBatchItemsPageComponent } from './containers/pharmacy-claims-batch-items-page/pharmacy-claims-batch-items-page.component';
import { PharmacyClaimsReconcilePageComponent } from './containers/pharmacy-claims-reconcile-page/pharmacy-claims-reconcile-page.component';
import { PharmacyClaimsBatchRouterPageComponent } from './containers/pharmacy-claims-batch-router-page/pharmacy-claims-router-batch-page.component';
import { PharmacyClaimsPaymentsRouterPageComponent } from './containers/pharmacy-claims-payments-router-page/pharmacy-claims-payments-router-page.component';
const routes = [
  {
    path: '',
    component: PharmacyClaimsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: PharmacyClaimsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: PharmacyClaimsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: PharmacyClaimsBatchPageComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: PharmacyClaimsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: PharmacyClaimsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
  }, 
  {
    path: 'payments',
    component: PharmacyClaimsPaymentsRouterPageComponent,
    data: {
      title: '',
    },
    children: [       
      {
        path: 'reconcile-payments',
        component: PharmacyClaimsReconcilePageComponent,
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
 
 
export class CaseManagementFeatureFinancialPharmacyClaimsRoutingModule { }
