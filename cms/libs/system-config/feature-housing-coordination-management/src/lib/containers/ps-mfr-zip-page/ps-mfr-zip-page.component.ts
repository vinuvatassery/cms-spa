import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-ps-mfr-zip-page',
  templateUrl: './ps-mfr-zip-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PsMfrZipPageComponent {

  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValuePSMFRZIPListGrid = this.systemConfigHousingCoordinationFacade.sortValuePSMFRZIPListGrid;
  sortPSMFRZIPListGrid = this.systemConfigHousingCoordinationFacade.sortPSMFRZIPListGrid;
  pSMFRZIP$ = this.systemConfigHousingCoordinationFacade.pSMFRZIP$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadPSMFRZIPList(data: any){
    this.systemConfigHousingCoordinationFacade.loadPSMFRZIPList();
  }
}
