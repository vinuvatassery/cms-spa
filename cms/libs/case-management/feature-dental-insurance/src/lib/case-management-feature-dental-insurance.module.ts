/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureDentalInsuranceRoutingModule } from './case-management-feature-dental-insurance-routing.module';
/** Components **/
import { DentalInsurancePageComponent } from './containers/dental-insurance-page/dental-insurance-page.component';
import { DentalInsuranceStatusDetailComponent } from './components/dental-insurance-status-detail/dental-insurance-status-detail.component';
import { DentalInsuranceStatusListComponent } from './components/dental-insurance-status-list/dental-insurance-status-list.component';
import { DentalPremiumListComponent } from './components/dental-premium-list/dental-premium-list.component';
import { DentalPremiumDetailComponent } from './components/dental-premium-detail/dental-premium-detail.component';
import { DentalPaymentDetailComponent } from './components/dental-payment-detail/dental-payment-detail.component';
import { DentalPaymentListComponent } from './components/dental-payment-list/dental-payment-list.component';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureDentalInsuranceRoutingModule,
  ],
  declarations: [
    DentalInsurancePageComponent,
    DentalInsuranceStatusDetailComponent,
    DentalInsuranceStatusListComponent,
    DentalPremiumListComponent,
    DentalPremiumDetailComponent,
    DentalPaymentDetailComponent,
    DentalPaymentListComponent,
  ],
  exports: [
    DentalInsurancePageComponent,
    DentalInsuranceStatusDetailComponent,
    DentalInsuranceStatusListComponent,
    DentalPremiumListComponent,
    DentalPremiumDetailComponent,
    DentalPaymentDetailComponent,
    DentalPaymentListComponent,
  ],
})
export class CaseManagementFeatureDentalInsuranceModule {}
