import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DentalPremiumsPageComponent } from './containers/dental-premiums/dental-premiums-page.component';
import { RouterModule } from '@angular/router';
import { DentalPremiumsBatchPageComponent } from './containers/dental-premiums-batch-page/dental-premiums-batch-page.component';
import { DentalPremiumsBatchItemsPageComponent } from './containers/dental-premiums-batch-items-page/dental-premiums-batch-items-page.component';
import { DentalPremiumsReconcilePageComponent } from './containers/dental-premiums-reconcile-page/dental-premiums-reconcile-page.component';
import { DentalPremiumsBatchRouterPageComponent } from './containers/dental-premiums-batch-router-page/dental-premiums-router-batch-page.component';
import { DentalPremiumsPaymentsRouterPageComponent } from './containers/dental-premiums-payments-router-page/dental-premiums-payments-router-page.component';
 

const routes = [
  {
    path: '',
    component: DentalPremiumsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: DentalPremiumsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: DentalPremiumsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: DentalPremiumsBatchPageComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: DentalPremiumsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: DentalPremiumsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
  }, 
  {
    path: 'payments',
    component: DentalPremiumsPaymentsRouterPageComponent,
    data: {
      title: 'Payments',
    },
    children: [       
      {
        path: 'reconcile-payments',
        component: DentalPremiumsReconcilePageComponent,
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
  exports:[RouterModule]
})
export class CaseManagementFeatureFinancialDentalPremiumsRoutingModule {}
