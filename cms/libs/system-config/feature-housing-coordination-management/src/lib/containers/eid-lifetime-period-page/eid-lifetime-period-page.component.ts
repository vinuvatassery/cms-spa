import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-eid-lifetime-period-page',
  templateUrl: './eid-lifetime-period-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EidLifetimePeriodPageComponent {
  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueEidLifeTime = this.systemConfigHousingCoordinationFacade.sortValueEidLifeListGrid;
  sortEidLifeTimeGrid = this.systemConfigHousingCoordinationFacade.sortCaseEidLifeListGrid;
  eidLifeTimeService$ = this.systemConfigHousingCoordinationFacade.caseAvailabilities$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadEidLifeTimeLists(data: any){
    this.systemConfigHousingCoordinationFacade.loadClientProfileCaseAvailabilities();
  }

}
