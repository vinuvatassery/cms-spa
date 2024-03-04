import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { ManufacturersListComponent } from './components/manufacturers-list/manufacturers-list.component';
import { DrugsListComponent } from './components/drugs-list/drugs-list.component';
import { ManufacturersDeactivateComponent } from './components/manufacturers-deactivate/manufacturers-deactivate.component';
import { ManufacturersDeleteComponent } from './components/manufacturers-delete/manufacturers-delete.component';
import { ManufacturersFormDetailsComponent } from './components/manufacturers-form-details/manufacturers-form-details.component';
import { DrugsFormDetailsComponent } from './components/drugs-form-details/drugs-form-details.component';
import { DrugsDeactivateComponent } from './components/drugs-deactivate/drugs-deactivate.component';
import { DrugsReassignComponent } from './components/drugs-reassign/drugs-reassign.component';
import { MedicalProvidersListComponent } from './components/medical-providers-list/medical-providers-list.component';
import { MedicalProvidersActivateComponent } from './components/medical-providers-activate/medical-providers-activate.component';
import { MedicalProvidersDeactivateComponent } from './components/medical-providers-deactivate/medical-providers-deactivate.component';
import { MedicalProvidersFormDetailsComponent } from './components/medical-providers-form-details/medical-providers-form-details.component';
import { MedicalProvidersDeleteComponent } from './components/medical-providers-delete/medical-providers-delete.component';
import { CptCodeDeleteComponent } from './components/cpt-code-delete/cpt-code-delete.component';
import { CptCodeListComponent } from './components/cpt-code-list/cpt-code-list.component';
import { CptCodeDeactivateComponent } from './components/cpt-code-deactivate/cpt-code-deactivate.component';
import { CptCodeActivateComponent } from './components/cpt-code-activate/cpt-code-activate.component';
import { CptCodeFormDetailsComponent } from './components/cpt-code-form-details/cpt-code-form-details.component';
import { InsuranceVendorsListComponent } from './components/insurance-vendors-list/insurance-vendors-list.component';
import { InsuranceVendorsFormDetailsComponent } from './components/insurance-vendors-form-details/insurance-vendors-form-details.component';
import { InsuranceProvideFormDetailsComponent } from './components/insurance-provide-form-details/insurance-provide-form-details.component';
import { InsuranceProvideListComponent } from './components/insurance-provide-list/insurance-provide-list.component';
import { InsurancePlanListComponent } from './components/insurance-plan-list/insurance-plan-list.component';
import { InsurancePlanFormDetailsComponent } from './components/insurance-plan-form-details/insurance-plan-form-details.component';
import { InsurancePlanBulkMigrationComponent } from './components/insurance-plan-bulk-migration/insurance-plan-bulk-migration.component';
import { PharmaciesListComponent } from './components/pharmacies-list/pharmacies-list.component';
import { PharmaciesFormDetailsComponent } from './components/pharmacies-form-details/pharmacies-form-details.component';
import { HealthcareProviderFormDetailsComponent } from './components/healthcare-provider-form-details/healthcare-provider-form-details.component';
import { HealthcareProviderListComponent } from './components/healthcare-provider-list/healthcare-provider-list.component';
import { InsuranceVendorsDeactivateComponent } from './components/insurance-vendors-deactivate/insurance-vendors-deactivate.component';
import { HealthcareProviderDeactivateComponent } from './components/healthcare-provider-deactivate/healthcare-provider-deactivate.component';
import { InsurancePlanDeactivateComponent } from './components/insurance-plan-deactivate/insurance-plan-deactivate.component';
import { PharmaciesDeactivateComponent } from './components/pharmacies-deactivate/pharmacies-deactivate.component';
import { InsuranceVendorsDeleteComponent } from './components/insurance-vendors-delete/insurance-vendors-delete.component';
import { InsurancePlanDeleteComponent } from './components/insurance-plan-delete/insurance-plan-delete.component';
import { InsuranceProvideDeleteComponent } from './components/insurance-provide-delete/insurance-provide-delete.component';
import { InsuranceProvideDeactivateComponent } from './components/insurance-provide-deactivate/insurance-provide-deactivate.component';
import { HealthcareProviderDeleteComponent } from './components/healthcare-provider-delete/healthcare-provider-delete.component';
import { PharmaciesDeleteComponent } from './components/pharmacies-delete/pharmacies-delete.component';
import { CptCodePageComponent } from './container/cpt-code-page/cpt-code-page.component';
import { DrugsPageComponent } from './container/drugs-page/drugs-page.component';
import { HealthcareProviderPageComponent } from './container/healthcare-provider-page/healthcare-provider-page.component';
import { InsurancePlanPageComponent } from './container/insurance-plan-page/insurance-plan-page.component';
import { InsuranceProvidePageComponent } from './container/insurance-provide-page/insurance-provide-page.component';
import { InsuranceVendorsPageComponent } from './container/insurance-vendors-page/insurance-vendors-page.component';
import { MedicalProvidersPageComponent } from './container/medical-providers-page/medical-providers-page.component';
import { PharmaciesPageComponent } from './container/pharmacies-page/pharmacies-page.component';
import { ManufacturersPageComponent } from './container/manufacturers-page/manufacturers-page.component';
import { SystemConfigFeatureServiceProviderRoutingModule } from './system-config-feature-service-provider.routing.module';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureServiceProviderRoutingModule],
  declarations: [
    ManufacturersListComponent,
    DrugsListComponent,
    ManufacturersDeactivateComponent,
    ManufacturersDeleteComponent,
    ManufacturersFormDetailsComponent,
    DrugsFormDetailsComponent,
    DrugsDeactivateComponent,
    DrugsReassignComponent,
    MedicalProvidersListComponent,
    MedicalProvidersActivateComponent,
    MedicalProvidersDeactivateComponent,
    MedicalProvidersFormDetailsComponent,
    MedicalProvidersDeleteComponent,
    CptCodeDeleteComponent,
    CptCodeListComponent,
    CptCodeDeactivateComponent,
    CptCodeActivateComponent,
    CptCodeFormDetailsComponent,
    InsuranceVendorsListComponent,
    InsuranceVendorsFormDetailsComponent,
    InsuranceProvideFormDetailsComponent,
    InsuranceProvideListComponent,
    InsurancePlanListComponent,
    InsurancePlanFormDetailsComponent,
    InsurancePlanBulkMigrationComponent,
    PharmaciesListComponent,
    PharmaciesFormDetailsComponent,
    HealthcareProviderFormDetailsComponent,
    HealthcareProviderListComponent,
    InsuranceVendorsDeactivateComponent,
    HealthcareProviderDeactivateComponent,
    InsurancePlanDeactivateComponent,
    PharmaciesDeactivateComponent,
    InsuranceVendorsDeleteComponent,
    InsurancePlanDeleteComponent,
    InsuranceProvideDeleteComponent,
    InsuranceProvideDeactivateComponent,
    HealthcareProviderDeleteComponent,
    PharmaciesDeleteComponent,
    CptCodePageComponent,
    DrugsPageComponent,
    HealthcareProviderPageComponent,
    InsurancePlanPageComponent,
    InsuranceProvidePageComponent,
    InsuranceVendorsPageComponent,
    ManufacturersPageComponent,
    MedicalProvidersPageComponent,
    PharmaciesPageComponent,
  ],
  exports: [
    ManufacturersListComponent,
    DrugsListComponent,
    ManufacturersDeactivateComponent,
    ManufacturersDeleteComponent,
    ManufacturersFormDetailsComponent,
    DrugsFormDetailsComponent,
    DrugsDeactivateComponent,
    DrugsReassignComponent,
    MedicalProvidersListComponent,
    MedicalProvidersActivateComponent,
    MedicalProvidersDeactivateComponent,
    MedicalProvidersFormDetailsComponent,
    MedicalProvidersDeleteComponent,
    CptCodeDeleteComponent,
    CptCodeListComponent,
    CptCodeDeactivateComponent,
    CptCodeActivateComponent,
    CptCodeFormDetailsComponent,
    InsuranceVendorsListComponent,
    InsuranceVendorsFormDetailsComponent,
    InsuranceProvideFormDetailsComponent,
    InsuranceProvideListComponent,
    InsurancePlanListComponent,
    InsurancePlanFormDetailsComponent,
    InsurancePlanBulkMigrationComponent,
    PharmaciesListComponent,
    PharmaciesFormDetailsComponent,
    HealthcareProviderFormDetailsComponent,
    HealthcareProviderListComponent,
    InsuranceVendorsDeactivateComponent,
    HealthcareProviderDeactivateComponent,
    InsurancePlanDeactivateComponent,
    PharmaciesDeactivateComponent,
    InsuranceVendorsDeleteComponent,
    InsurancePlanDeleteComponent,
    InsuranceProvideDeleteComponent,
    InsuranceProvideDeactivateComponent,
    HealthcareProviderDeleteComponent,
    PharmaciesDeleteComponent,
    CptCodePageComponent,
    DrugsPageComponent,
    HealthcareProviderPageComponent,
    InsurancePlanPageComponent,
    InsuranceProvidePageComponent,
    InsuranceVendorsPageComponent,
    ManufacturersPageComponent,
    MedicalProvidersPageComponent,
    PharmaciesPageComponent,
    
  ],
})
export class SystemConfigFeatureServiceProviderModule {}
