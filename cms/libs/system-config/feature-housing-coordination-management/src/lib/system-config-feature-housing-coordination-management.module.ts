import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiTpaModule } from '@cms/shared/ui-tpa';
import { SharedUiCommonModule } from '@cms/shared/ui-common';
import { HousingCoordinationPageComponent } from './containers/housing-coordination-page/housing-coordination-page.component';
import { SlotListComponent } from './components/slot-list/slot-list.component';
import { SlotDetailComponent } from './components/slot-detail/slot-detail.component';
import { CaseAvailabilityListComponent } from './components/case-availability-list/case-availability-list.component';
import { CaseAvailabilityDetailComponent } from './components/case-availability-detail/case-availability-detail.component';
import { EidLifetimePeriodListComponent } from './components/eid-lifetime-period-list/eid-lifetime-period-list.component';
import { EidLifetimePeriodDetailComponent } from './components/eid-lifetime-period-detail/eid-lifetime-period-detail.component';
import { HousingAcuityLevelListComponent } from './components/housing-acuity-level-list/housing-acuity-level-list.component';
import { IncomeInclusionsExclusionsListComponent } from './components/income-inclusions-exclusions-list/income-inclusions-exclusions-list.component';
import { RegionAssignmentListComponent } from './components/region-assignment-list/region-assignment-list.component';
import { ServiceProviderListComponent } from './components/service-provider-list/service-provider-list.component';
import { ServiceProviderDetailComponent } from './components/service-provider-detail/service-provider-detail.component';
import { RegionAssignmentDetailComponent } from './components/region-assignment-detail/region-assignment-detail.component';
import { IncomeInclusionsExclusionsDetailComponent } from './components/income-inclusions-exclusions-detail/income-inclusions-exclusions-detail.component';
import { HousingAcuityLevelDetailComponent } from './components/housing-acuity-level-detail/housing-acuity-level-detail.component';

import { PsMfrZipDetailComponent } from './components/ps-mfr-zip-detail/ps-mfr-zip-detail.component';
import { PsMfrZipListComponent } from './components/ps-mfr-zip-list/ps-mfr-zip-list.component';





@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [
    HousingCoordinationPageComponent,
    SlotListComponent,
    SlotDetailComponent,
    CaseAvailabilityListComponent,
    CaseAvailabilityDetailComponent,
    EidLifetimePeriodListComponent,
    EidLifetimePeriodDetailComponent,
    HousingAcuityLevelListComponent,
    IncomeInclusionsExclusionsListComponent,
    RegionAssignmentListComponent,
    ServiceProviderListComponent,
    ServiceProviderDetailComponent,
    RegionAssignmentDetailComponent,
    IncomeInclusionsExclusionsDetailComponent,
    HousingAcuityLevelDetailComponent,
    PsMfrZipDetailComponent,
    PsMfrZipListComponent
   
    
    
    
  ],
  exports: [
    HousingCoordinationPageComponent,
    SlotListComponent,
    SlotDetailComponent,
    CaseAvailabilityListComponent,
    CaseAvailabilityDetailComponent,
    EidLifetimePeriodListComponent,
    EidLifetimePeriodDetailComponent,
    HousingAcuityLevelListComponent,
    IncomeInclusionsExclusionsListComponent,  
    RegionAssignmentListComponent, 
    RegionAssignmentDetailComponent,
    IncomeInclusionsExclusionsDetailComponent, 
    HousingAcuityLevelDetailComponent, 
    PsMfrZipDetailComponent, 
    PsMfrZipListComponent
      
     
   
  ],
})
export class SystemConfigFeatureHousingCoordinationManagementModule { }
