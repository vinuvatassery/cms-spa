import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalPremiumsPageComponent } from './containers/medical-premiums/medical-premiums-page.component';
import { RouterModule } from '@angular/router';
import { MedicalPremiumsBatchPageComponent } from './containers/medical-premiums-batch-page/medical-premiums-batch-page.component';
import { MedicalPremiumsBatchItemsPageComponent } from './containers/medical-premiums-batch-items-page/medical-premiums-batch-items-page.component';
import { MedicalPremiumsReconcilePageComponent } from './containers/medical-premiums-reconcile-page/medical-premiums-reconcile-page.component';
import { MedicalPremiumsBatchRouterPageComponent } from './containers/medical-premiums-batch-router-page/medical-premiums-router-batch-page.component';
import { MedicalPremiumsPaymentsRouterPageComponent } from './containers/medical-premiums-payments-router-page/medical-premiums-payments-router-page.component';
 

const routes = [
  {
    path: '',
    component: MedicalPremiumsPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch',
    component: MedicalPremiumsBatchRouterPageComponent,
    data: {
      title: 'Batch',
    },
    children: [ 
     
      {
        path: '',
        component: MedicalPremiumsBatchPageComponent,
        data: {
          title: 'Batch Log'
        },
      },
      {
        path: 'batch-log',
        component: MedicalPremiumsBatchPageComponent,
        data: {
          title: 'batch-log'
        },
      },
     
      {
        path: 'items',
        component: MedicalPremiumsBatchItemsPageComponent,
        data: {
          title: 'Items'
        },
      }, 
      {
        path: 'reconcile-payments',
        component: MedicalPremiumsReconcilePageComponent,
        data: {
          title: 'Reconcile Payments' 
        },
      }, 
    ]
  }, 
  {
    path: 'payments',
    component: MedicalPremiumsPaymentsRouterPageComponent,
    data: {
      title: 'Payments',
    },
    children: [       
      {
        path: 'reconcile-payments',
        component: MedicalPremiumsReconcilePageComponent,
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
  exports: [RouterModule]
})
export class CaseManagementFeatureFinancialInsurancePremiumsRoutingModule { }
