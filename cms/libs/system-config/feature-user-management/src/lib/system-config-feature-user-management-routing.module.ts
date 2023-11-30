/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenderListComponent, LanguageListComponent, PronounsListComponent, RacialOrEthnicIdentityListComponent, SexualOrientationListComponent } from '@cms/system-config/feature-client-profile-management';
import { EmailTemplateListComponent, LetterTemplateListComponent, SmsTextTemplateListComponent } from '@cms/system-config/feature-communication';
import { ExpenseTypesListComponent, FundsListComponent, IncomeTypesListComponent, IndexListComponent, PcaCodesListComponent } from '@cms/system-config/feature-financials';
import { CaseAvailabilityListComponent, EidLifetimePeriodListComponent, HousingAcuityLevelListComponent, IncomeInclusionsExclusionsListComponent, PsMfrZipListComponent, RegionAssignmentListComponent, ServiceProviderListComponent, SlotListComponent } from '@cms/system-config/feature-housing-coordination-management';
import { RolesAndPermissionsDetailComponent } from './components/roles-and-permissions-detail/roles-and-permissions-detail.component';
import { RolesAndPermissionsListComponent } from './components/roles-and-permissions-list/roles-and-permissions-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserManagementPageComponent } from './containers/user-management-page/user-management-page.component'; 
import { CaseAssignmentComponent, EligibilityCheckListComponent } from '@cms/system-config/feature-cases';
import { AssisterGroupsListComponent, DomainsListComponent } from '@cms/system-config-feature-other-lists';
import { CptCodeListComponent, DrugsListComponent, HealthcareProviderListComponent, InsurancePlanListComponent, InsuranceProvideListComponent, InsuranceVendorsListComponent, ManufacturersListComponent, MedicalProvidersListComponent, PharmaciesListComponent } from '@cms/system-config-feature-service-provider';
 
const routes: Routes = [
  {
    path: '',
    component: UserManagementPageComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'roles-and-permissions',
        component: RolesAndPermissionsListComponent,
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'pronouns',
        component: PronounsListComponent,
      },
      {
        path: 'gender',
        component: GenderListComponent,
      },
      {
        path: 'sexual-orientation',
        component: SexualOrientationListComponent,
      },
      {
        path: 'racial-or-ethnic-identity',
        component: RacialOrEthnicIdentityListComponent,
      },
      {
        path: 'languages',
        component: LanguageListComponent,
      },
      {
        path: 'slots',
        component: SlotListComponent,
      },
      {
        path: 'case-availability',
        component: CaseAvailabilityListComponent,
      },
      {
        path: 'eid-period',
        component: EidLifetimePeriodListComponent,
      },
      {
        path: 'housing-acuity-level',
        component: HousingAcuityLevelListComponent,
      },
      {
        path: 'income-inclusions-exlusions',
        component: IncomeInclusionsExclusionsListComponent
      },
      
      {
        path: 'region-assignment',
        component: RegionAssignmentListComponent
      },
      
      {
        path: 'service-provider',
        component: ServiceProviderListComponent
      },
      {
        path: 'ps-fmr-zip',
        component: PsMfrZipListComponent
      },
      {
        path: 'funds',
        component: FundsListComponent
      },
      {
        path: 'expende-types',
        component: ExpenseTypesListComponent
      },
      {
        path: 'income-types',
        component: IncomeTypesListComponent
      },
      {
        path: 'index',
        component: IndexListComponent
      },
      {
        path: 'pca-codes',
        component: PcaCodesListComponent
      },
      {
        path: 'email-template',
        component: EmailTemplateListComponent
      },
      {
        path: 'letter-template',
        component: LetterTemplateListComponent
      },
      {
        path: 'sms-text-template',
        component: SmsTextTemplateListComponent
      },
     
      {
        path: 'case-assignment',
        component: CaseAssignmentComponent
      },
      {
        path: 'eligibility-checklist',
        component: EligibilityCheckListComponent
      },
      {
        path: 'assister-groups',
        component: AssisterGroupsListComponent
      },
      {
        path: 'domains',
        component: DomainsListComponent
      },
      {
        path: 'manufacturers',
        component: ManufacturersListComponent
      },
      {
        path: 'drugs',
        component: DrugsListComponent
      },
      {
        path: 'medical-providers',
        component: MedicalProvidersListComponent
      },
      {
        path: 'ppt-code',
        component: CptCodeListComponent
      },
      {
        path: 'insurance-vendors',
        component: InsuranceVendorsListComponent
      },
      {
        path: 'insurance-provide',
        component: InsuranceProvideListComponent
      },
      {
        path: 'insurance-plan',
        component: InsurancePlanListComponent
      },
      {
        path: 'pharmacies',
        component: PharmaciesListComponent
      },
      {
        path: 'healthcare-provider',
        component: HealthcareProviderListComponent
      },
    ],
  },
  {
    path: 'roles-and-permissions-detail',
    component: RolesAndPermissionsDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureUserManagementRoutingModule { }
