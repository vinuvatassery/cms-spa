import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-region-assignment-page',
  templateUrl: './region-assignment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionAssignmentPageComponent {
  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueRegionAssignmentListGrid = this.systemConfigHousingCoordinationFacade.sortValueRegionAssignmentListGrid;
  sortRegionAssignmentListGrid = this.systemConfigHousingCoordinationFacade.sortRegionAssignmentListGrid;
  regionAssignment$ = this.systemConfigHousingCoordinationFacade.regionAssignment$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadRegionAssignmentList(data: any){
    this.systemConfigHousingCoordinationFacade.loadRegionAssignmentList();
  }
}
