import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { CaseAvailabilityPageComponent } from './containers/case-availability-page/case-availability-page.component';
import { EidLifetimePeriodPageComponent } from './containers/eid-lifetime-period-page/eid-lifetime-period-page.component';
import { HousingAcuityLevelPageComponent } from './containers/housing-acuity-level-page/housing-acuity-level-page.component';
import { IncomeInclusionsExclusionsPageComponent } from './containers/income-inclusions-exclusions-page/income-inclusions-exclusions-page.component';
import { PsMfrZipPageComponent } from './containers/ps-mfr-zip-page/ps-mfr-zip-page.component';
import { RegionAssignmentPageComponent } from './containers/region-assignment-page/region-assignment-page.component';
import { ServiceProviderPageComponent } from './containers/service-provider-page/service-provider-page.component';
import { SlotPageComponent } from './containers/slot-page/slot-page.component';

const routes: Routes = [
  {
    path: '',
    component: SlotPageComponent,
 
  }, 
  {
    path: 'slots',
    component: SlotPageComponent,
  },
  {
    path: 'case-availability',
    component: CaseAvailabilityPageComponent,
  },
  {
    path: 'eid-period',
    component: EidLifetimePeriodPageComponent,
  },
  {
    path: 'housing-acuity-level',
    component: HousingAcuityLevelPageComponent,
  },
  {
    path: 'income-inclusions-exlusions',
    component: IncomeInclusionsExclusionsPageComponent,
  },
  {
    path: 'ps-fmr-zip',
    component: PsMfrZipPageComponent,
  },
  {
    path: 'region-assignment',
    component: RegionAssignmentPageComponent,
  },
  {
    path: 'service-provider',
    component: ServiceProviderPageComponent,
  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureHousingCoordinationManagementRoutingModule {}
