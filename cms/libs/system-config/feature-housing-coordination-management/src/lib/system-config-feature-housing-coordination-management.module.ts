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

@NgModule({
  imports: [CommonModule, SharedUiTpaModule, SharedUiCommonModule],
  declarations: [
    HousingCoordinationPageComponent,
    SlotListComponent,
    SlotDetailComponent,
    CaseAvailabilityListComponent,
    CaseAvailabilityDetailComponent,
    EidLifetimePeriodListComponent,
    EidLifetimePeriodDetailComponent
  ],
  exports: [
    HousingCoordinationPageComponent,
    SlotListComponent,
    SlotDetailComponent,
    CaseAvailabilityListComponent,
    CaseAvailabilityDetailComponent,
    EidLifetimePeriodListComponent,
    EidLifetimePeriodDetailComponent
  ],
})
export class SystemConfigFeatureHousingCoordinationManagementModule { }
