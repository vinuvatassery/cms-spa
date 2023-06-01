import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { VendorRefundPageComponent } from './containers/vendor-refund-page/vendor-refund-page.component';
import { CaseManagementFeatureFinancialVendorRefundRoutingModule } from './case-management-feature-financial-vendor-refund.routing.module';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementFeatureFinancialVendorRefundRoutingModule,
    SharedUiTpaModule,
    SharedUiCommonModule,
  ],
  declarations: [
    VendorRefundPageComponent
  ],
})
export class CaseManagementFeatureFinancialVendorRefundModule {}
