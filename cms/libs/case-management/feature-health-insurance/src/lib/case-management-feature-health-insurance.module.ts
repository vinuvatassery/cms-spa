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
import { MedicalPremiumDetailInsuranceCarrierNameComponent } from './components/medical-premium-detail-insurance-carrier-name/medical-premium-detail-insurance-carrier-name.component';
import { MedicalPremiumDetailInsurancePlanNameComponent } from './components/medical-premium-detail-insurance-plan-name/medical-premium-detail-insurance-plan-name.component';
import { MedicalPremiumDetailMetalLevelComponent } from './components/medical-premium-detail-metal-level/medical-premium-detail-metal-level.component';
import { MedicalPremiumDetailAPTCComponent } from './components/medical-premium-detail-aptc/medical-premium-detail-aptc.component';
import { MedicalPremiumDetailGroupPlanTypeComponent } from './components/medical-premium-detail-group-plan-type/medical-premium-detail-group-plan-type.component';
import { MedicalPremiumDetailClientPolicyHolderComponent } from './components/medical-premium-detail-client-policy-holder/medical-premium-detail-client-policy-holder.component';
import { MedicalPremiumDetailCareassistPayComponent } from './components/medical-premium-detail-careassist-pay/medical-premium-detail-careassist-pay.component';
import { MedicalPremiumDetailOthersCoveredPlanComponent } from './components/medical-premium-detail-others-covered-plan/medical-premium-detail-others-covered-plan.component';
import { MedicalCarrierContactInfoComponent } from './components/medical-carrier-contact-info/medical-carrier-contact-info.component';
import { ProfileHealthInsurancePageComponent } from './containers/profile-healthe-insurance/profile-health-insurance-page.component';
import { MedicalPremiumPaymentDetailComponent } from './components/medical-premium-payment-detail/medical-premium-payment-detail.component';
import { DeactivateInsuranceConfirmationComponent } from './components/deactivate-medical-premium-confirmation/deactivate-medical-premium.component';
import { VendorPanelDetailsComponent } from './components/vendorPanelDetails/vendor-panel-details.component';


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
    MedicalPremiumDetailInsuranceCarrierNameComponent,
    MedicalPremiumDetailInsurancePlanNameComponent,
    MedicalPremiumDetailMetalLevelComponent,
    MedicalPremiumDetailAPTCComponent,
    MedicalPremiumDetailGroupPlanTypeComponent,
    MedicalPremiumDetailClientPolicyHolderComponent,
    MedicalPremiumDetailCareassistPayComponent,
    MedicalPremiumDetailOthersCoveredPlanComponent,
    MedicalCarrierContactInfoComponent,
    ProfileHealthInsurancePageComponent,
    MedicalPremiumPaymentDetailComponent,
    DeactivateInsuranceConfirmationComponent,
    VendorPanelDetailsComponent
  
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
    ProfileHealthInsurancePageComponent,
    DeactivateInsuranceConfirmationComponent,
  ],
})
export class CaseManagementFeatureHealthInsuranceModule {}
