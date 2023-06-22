import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { VendorRefundPageComponent } from './containers/vendor-refund-page/vendor-refund-page.component';
import { RefundBatchLogListComponent } from './components/refund-batch-log-list/refund-batch-log-list.component';

const routes = [
  {
    path: '',
    component: VendorRefundPageComponent,
    data: {
      title: '',
    },
  },
  {
    path: 'batch-log',
    component: RefundBatchLogListComponent,
  } 
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialVendorRefundRoutingModule { }
