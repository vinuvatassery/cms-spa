import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DentalClaimsPageComponent } from './containers/dental-claims/dental-claims-page.component';
import { DentalClaimsBatchItemsPageComponent } from './containers/dental-claims-batch-items-page/dental-claims-batch-items-page.component';
import { DentalClaimsBatchPageComponent } from './containers/dental-claims-batch-page/dental-claims-batch-page.component';
import { DentalClaimsBatchRouterPageComponent } from './containers/dental-claims-batch-router-page/dental-claims-router-batch-page.component';
import { DentalClaimsPaymentsRouterPageComponent } from './containers/dental-claims-payments-router-page/dental-claims-payments-router-page.component';
import { DentalClaimsReconcilePageComponent } from './containers/dental-claims-reconcile-page/dental-claims-reconcile-page.component';

 
  const routes = [
    {
      path: '',
      component: DentalClaimsPageComponent,
      data: {
        title: '',
      },
    },
    {
      path: 'batch',
      component: DentalClaimsBatchRouterPageComponent,
      data: {
        title: 'Batch',
      },
      children: [ 
       
        {
          path: '',
          component: DentalClaimsBatchPageComponent,
          data: {
            title: 'Batch Log'
          },
        },
        {
          path: 'batch-log',
          component: DentalClaimsBatchPageComponent,
          data: {
            title: 'batch-log'
          },
        },
       
        {
          path: 'items',
          component: DentalClaimsBatchItemsPageComponent,
          data: {
            title: 'Items'
          },
        }, 
        {
          path: 'reconcile-payments',
          component: DentalClaimsReconcilePageComponent,
          data: {
            title: 'Reconcile Payments' 
          },
        }, 
      ]
    }, 
    {
      path: 'payments',
      component: DentalClaimsPaymentsRouterPageComponent,
      data: {
        title: 'Payments',
      },
      children: [       
        {
          path: 'reconcile-payments',
          component: DentalClaimsReconcilePageComponent,
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
export class CaseManagementFeatureFinancialDentalClaimsRoutingModule { }
