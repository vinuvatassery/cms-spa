/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Modules **/
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { CaseManagementDomainModule } from '@cms/case-management/domain';
import { CaseManagementFeatureHealthcareProviderRoutingModule } from './case-management-feature-healthcare-provider-routing.module';
/** Components **/
import { HealthcareProviderPageComponent } from './containers/healthcare-provider-page/healthcare-provider-page.component';
import { HealthCareProviderListComponent } from './components/health-care-provider-list/health-care-provider-list.component';
import { HealthCareProviderDetailComponent } from './components/health-care-provider-detail/health-care-provider-detail.component';
import { RemoveHealthCareProviderConfirmationComponent } from './components/remove-health-care-provider-confirmation/remove-health-care-provider-confirmation.component';
import { HealthCareProviderSearchComponent } from './components/health-care-provider-search/health-care-provider-search.component';


@NgModule({
  imports: [
    CommonModule,
    SharedUiTpaModule,
    CaseManagementDomainModule,
    CaseManagementFeatureHealthcareProviderRoutingModule,
  ],
  declarations: [
    HealthcareProviderPageComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    RemoveHealthCareProviderConfirmationComponent,
    HealthCareProviderSearchComponent
  ],
  exports: [
    HealthcareProviderPageComponent,
    HealthCareProviderListComponent,
    HealthCareProviderDetailComponent,
    RemoveHealthCareProviderConfirmationComponent,
    HealthCareProviderSearchComponent
  ],
})
export class CaseManagementFeatureHealthcareProviderModule {}
