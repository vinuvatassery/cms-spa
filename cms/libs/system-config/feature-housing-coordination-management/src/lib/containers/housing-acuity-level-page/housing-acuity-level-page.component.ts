import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-housing-acuity-level-page',
  templateUrl: './housing-acuity-level-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HousingAcuityLevelPageComponent {
  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueHousingAcuityListGrid = this.systemConfigHousingCoordinationFacade.sortValueHousingAcuityListGrid;
  sortHousingAcuityListGrid = this.systemConfigHousingCoordinationFacade.sortHousingAcuityListGrid;
  housingAcuityLevel$ = this.systemConfigHousingCoordinationFacade.housingAcuityLevel$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadHousingAcuityLists(data: any){
    this.systemConfigHousingCoordinationFacade.loadHousingAcuityLevelList();
  }
}
