import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-case-availability-page',
  templateUrl: './case-availability-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseAvailabilityPageComponent {

  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueCaseAvailability = this.systemConfigHousingCoordinationFacade.sortValueCaseAvailabilityListGrid;
  sortCaseAvailabilityGrid = this.systemConfigHousingCoordinationFacade.sortCaseAvailabilityListGrid;
  caseAvailabilityService$ = this.systemConfigHousingCoordinationFacade.caseAvailabilities$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadCaseAvailabilityLists(data: any){
    this.systemConfigHousingCoordinationFacade.loadClientProfileCaseAvailabilities();
  }
}
