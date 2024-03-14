import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseAvailabilityDetailComponent } from './components/case-availability-detail/case-availability-detail.component';
import { CaseAvailabilityListComponent } from './components/case-availability-list/case-availability-list.component';
import { EidLifetimePeriodDetailComponent } from './components/eid-lifetime-period-detail/eid-lifetime-period-detail.component';
import { EidLifetimePeriodListComponent } from './components/eid-lifetime-period-list/eid-lifetime-period-list.component';
import { HousingAcuityLevelDetailComponent } from './components/housing-acuity-level-detail/housing-acuity-level-detail.component';
import { HousingAcuityLevelListComponent } from './components/housing-acuity-level-list/housing-acuity-level-list.component';
import { IncomeInclusionsExclusionsDetailComponent } from './components/income-inclusions-exclusions-detail/income-inclusions-exclusions-detail.component';
import { IncomeInclusionsExclusionsListComponent } from './components/income-inclusions-exclusions-list/income-inclusions-exclusions-list.component';
import { PsMfrZipDetailComponent } from './components/ps-mfr-zip-detail/ps-mfr-zip-detail.component';
import { PsMfrZipListComponent } from './components/ps-mfr-zip-list/ps-mfr-zip-list.component';
import { RegionAssignmentDetailComponent } from './components/region-assignment-detail/region-assignment-detail.component';
import { RegionAssignmentListComponent } from './components/region-assignment-list/region-assignment-list.component';
import { ServiceProviderDetailComponent } from './components/service-provider-detail/service-provider-detail.component';
import { ServiceProviderListComponent } from './components/service-provider-list/service-provider-list.component';
import { SlotDetailComponent } from './components/slot-detail/slot-detail.component';
import { SlotListComponent } from './components/slot-list/slot-list.component';
import { HousingCoordinationPageComponent } from './containers/housing-coordination-page/housing-coordination-page.component';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { CaseAvailabilityPageComponent } from './containers/case-availability-page/case-availability-page.component';
import { EidLifetimePeriodPageComponent } from './containers/eid-lifetime-period-page/eid-lifetime-period-page.component';
import { HousingAcuityLevelPageComponent } from './containers/housing-acuity-level-page/housing-acuity-level-page.component';
import { PsMfrZipPageComponent } from './containers/ps-mfr-zip-page/ps-mfr-zip-page.component';
import { ServiceProviderPageComponent } from './containers/service-provider-page/service-provider-page.component';
import { SlotPageComponent } from './containers/slot-page/slot-page.component';
import { IncomeInclusionsExclusionsPageComponent } from './containers/income-inclusions-exclusions-page/income-inclusions-exclusions-page.component';
import { RegionAssignmentPageComponent } from './containers/region-assignment-page/region-assignment-page.component';
import { SystemConfigFeatureHousingCoordinationManagementRoutingModule } from './system-config-feature-housing-coordination-management.routing.module';

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule, SystemConfigFeatureHousingCoordinationManagementRoutingModule],
  declarations: [
    CaseAvailabilityDetailComponent,
    CaseAvailabilityListComponent,
    EidLifetimePeriodDetailComponent,
    EidLifetimePeriodListComponent,
    HousingAcuityLevelDetailComponent,
    HousingAcuityLevelListComponent,
    IncomeInclusionsExclusionsDetailComponent,
    IncomeInclusionsExclusionsListComponent,
    PsMfrZipDetailComponent,
    PsMfrZipListComponent,
    RegionAssignmentDetailComponent,
    RegionAssignmentListComponent,
    ServiceProviderDetailComponent,
    ServiceProviderListComponent,
    SlotDetailComponent,
    SlotListComponent,
    HousingCoordinationPageComponent,
    EidLifetimePeriodPageComponent,
    HousingAcuityLevelPageComponent,
    HousingCoordinationPageComponent,
    IncomeInclusionsExclusionsPageComponent,
    PsMfrZipPageComponent,
    RegionAssignmentPageComponent,
    ServiceProviderPageComponent,
    SlotPageComponent,
    CaseAvailabilityPageComponent
  ],
  exports: [
    CaseAvailabilityDetailComponent,
    CaseAvailabilityListComponent,
    EidLifetimePeriodDetailComponent,
    EidLifetimePeriodListComponent,
    HousingAcuityLevelDetailComponent,
    HousingAcuityLevelListComponent,
    IncomeInclusionsExclusionsDetailComponent,
    IncomeInclusionsExclusionsListComponent,
    PsMfrZipDetailComponent,
    PsMfrZipListComponent,
    RegionAssignmentDetailComponent,
    RegionAssignmentListComponent,
    ServiceProviderDetailComponent,
    ServiceProviderListComponent,
    SlotDetailComponent,
    SlotListComponent,
    HousingCoordinationPageComponent,
    EidLifetimePeriodPageComponent,
    HousingAcuityLevelPageComponent,
    HousingCoordinationPageComponent,
    IncomeInclusionsExclusionsPageComponent,
    PsMfrZipPageComponent,
    RegionAssignmentPageComponent,
    ServiceProviderPageComponent,
    SlotPageComponent,
    CaseAvailabilityPageComponent
  ],
})
export class SystemConfigFeatureHousingCoordinationManagementModule {}
