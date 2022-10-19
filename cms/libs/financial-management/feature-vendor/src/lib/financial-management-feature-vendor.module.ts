/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { FinancialManagementDomainModule } from '@cms/financial-management/domain';
import { FinancialManagementFeatureVendorRoutingModule } from './financial-management-feature-vendor-routing.module';
/** Components **/
import { VendorPageComponent } from './containers/vendor-page/vendor-page.component';

@NgModule({
  imports: [
    CommonModule,
    FinancialManagementFeatureVendorRoutingModule,
    FinancialManagementDomainModule,
    SharedUiCommonModule,
  ],
  declarations: [VendorPageComponent],
  exports: [VendorPageComponent],
})
export class FinancialManagementFeatureVendorModule {}
