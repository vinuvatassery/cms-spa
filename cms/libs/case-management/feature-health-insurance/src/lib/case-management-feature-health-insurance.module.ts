/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { SystemConfigFeatureUserManagementModule } from '@cms/system-config/feature-user-management';
import { CaseManagementFeatureHealthInsuranceRoutingModule } from './case-management-feature-health-insurance-routing.module';
/** Components **/
import { MedicalInsuranceStatusListComponent } from './components/medical-insurance-status-list/medical-insurance-status-list.component';
import { MedicalInsuranceStatusDetailComponent } from './components/medical-insurance-status-detail/medical-insurance-status-detail.component';
import { MedicalPaymentListComponent } from './components/medical-payment-list/medical-payment-list.component';
import { MedicalPaymentDetailComponent } from './components/medical-payment-detail/medical-payment-detail.component';
import { MedicalPremiumDetailComponent } from './components/medical-premium-detail/medical-premium-detail.component';
import { MedicalPremiumListComponent } from './components/medical-premium-list/medical-premium-list.component';
import { SetHealthInsurancePriorityComponent } from './components/set-health-insurance-priority/set-health-insurance-priority.component';
import { HealthInsurancePageComponent } from './containers/health-insurance-page/health-insurance-page.component';
import { CoPaysAndDeductiblesListComponent } from './components/co-pays-and-deductibles-list/co-pays-and-deductibles-list.component';
import { CoPaysAndDeductiblesDetailComponent } from './components/co-pays-and-deductibles-detail/co-pays-and-deductibles-detail.component';
import { SharedUiCommonModule } from '@cms/shared/ui-common';

@NgModule({
  imports: [
    CommonModule,
    CaseManagementDomainModule,
    CaseManagementFeatureHealthInsuranceRoutingModule,
    SharedUiCommonModule,
    SharedUiTpaModule,
    SystemConfigFeatureUserManagementModule,
  ],
  declarations: [
    MedicalInsuranceStatusListComponent,
    MedicalInsuranceStatusDetailComponent,
    MedicalPaymentListComponent,
    MedicalPaymentDetailComponent,
    MedicalPremiumDetailComponent,
    MedicalPremiumListComponent,
    SetHealthInsurancePriorityComponent,
    HealthInsurancePageComponent,
    CoPaysAndDeductiblesListComponent,
    CoPaysAndDeductiblesDetailComponent,
  ],
  exports: [
    MedicalInsuranceStatusListComponent,
    MedicalInsuranceStatusDetailComponent,
    MedicalPaymentListComponent,
    MedicalPaymentDetailComponent,
    MedicalPremiumDetailComponent,
    MedicalPremiumListComponent,
    SetHealthInsurancePriorityComponent,
    CoPaysAndDeductiblesListComponent,
    CoPaysAndDeductiblesDetailComponent,
  ],
})
export class CaseManagementFeatureHealthInsuranceModule {}
