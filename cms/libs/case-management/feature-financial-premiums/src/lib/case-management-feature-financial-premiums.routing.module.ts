import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialPremiumsPageComponent } from './containers/financial-premiums/financial-premiums-page.component';
import { RouterModule } from '@angular/router';
import { FinancialPremiumsBatchPageComponent } from './containers/financial-premiums-batch-page/financial-premiums-batch-page.component';
import { FinancialPremiumsBatchItemsPageComponent } from './containers/financial-premiums-batch-items-page/financial-premiums-batch-items-page.component';
import { FinancialPremiumsReconcilePageComponent } from './containers/financial-premiums-reconcile-page/financial-premiums-reconcile-page.component';
import { FinancialPremiumsBatchRouterPageComponent } from './containers/financial-premiums-batch-router-page/financial-premiums-router-batch-page.component';
import { FinancialPremiumsPaymentsRouterPageComponent } from './containers/financial-premiums-payments-router-page/financial-premiums-payments-router-page.component';


const routes = [
  {
    path: '',
    component: FinancialPremiumsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: FinancialPremiumsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [     
      {
        path: '',
        component: FinancialPremiumsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: FinancialPremiumsBatchPageComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: FinancialPremiumsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: FinancialPremiumsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
  }, 

  {
    path: 'payments',
    component:FinancialPremiumsPaymentsRouterPageComponent,
    data: {
      title: '',
    },
    children: [       
      {
        path: 'reconcile-payments',
        component: FinancialPremiumsReconcilePageComponent,
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
  exports: [RouterModule]
})
export class CaseManagementFeatureFinancialPremiumsRoutingModule { }
