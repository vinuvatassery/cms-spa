import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-slot-page',
  templateUrl: './slot-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotPageComponent {
  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueSlotsListGrid = this.systemConfigHousingCoordinationFacade.sortValueSlotsListGrid;
  sortSlotsListGrid = this.systemConfigHousingCoordinationFacade.sortSlotsListGrid;
  slots$ = this.systemConfigHousingCoordinationFacade.slots$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadSlots(data: any){
    this.systemConfigHousingCoordinationFacade.loadSlots();
  }
}
