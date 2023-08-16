import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialClaimsPageComponent } from './containers/financial-claims-page/financial-claims-page.component';
import { RouterModule } from '@angular/router';
import { FinancialClaimsBatchPageComponent } from './containers/financial-claims-batch-page/financial-claims-batch-page.component';
import { FinancialClaimsBatchItemsPageComponent } from './containers/financial-claims-batch-items-page/financial-claims-batch-items-page.component';
import { FinancialClaimsReconcilePageComponent } from './containers/financial-claims-reconcile-page/financial-claims-reconcile-page.component';
import { FinancialClaimsBatchRouterPageComponent } from './containers/financial-claims-batch-router-page/financial-claims-router-batch-page.component';
import { FinancialClaimsPaymentsRouterPageComponent } from './containers/financial-claims-payments-router-page/financial-claims-payments-router-page.component';

const routes = [
  {
    path: '',
    component: FinancialClaimsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: FinancialClaimsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: FinancialClaimsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: FinancialClaimsBatchPageComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: FinancialClaimsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: FinancialClaimsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
  }, 
  {
    path: 'payments',
    component: FinancialClaimsPaymentsRouterPageComponent,
    data: {
      title: '',
    },
    children: [       
      {
        path: 'reconcile-payments',
        component: FinancialClaimsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments',
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
export class CaseManagementFeatureFinancialClaimsRoutingModule { }
 
