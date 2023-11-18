import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { VendorRefundPageComponent } from './containers/vendor-refund-page/vendor-refund-page.component';
import { RefundBatchLogListComponent } from './components/refund-batch-log-list/refund-batch-log-list.component';
import { RefundBatchPageComponent } from './containers/refund-batch-page/refund-batch-page.component';

const routes = [
  {
    path: '',
    component: VendorRefundPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch/batch-log-list',
    component: RefundBatchPageComponent,
  }, 
  {
    path: 'batch',
    component: RefundBatchPageComponent,
  }, 
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialVendorRefundRoutingModule { }
