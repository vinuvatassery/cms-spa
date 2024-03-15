import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigHousingCoordinationFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-service-provider-page',
  templateUrl: './service-provider-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceProviderPageComponent {

  state!: State;
  sortType = this.systemConfigHousingCoordinationFacade.sortType;
  pageSizes = this.systemConfigHousingCoordinationFacade.gridPageSizes;
  gridSkipCount = this.systemConfigHousingCoordinationFacade.skipCount;
  sortValueServiceProviderListGrid = this.systemConfigHousingCoordinationFacade.sortValueServiceProviderListGrid;
  sortServiceProviderListGrid = this.systemConfigHousingCoordinationFacade.sortServiceProviderListGrid;
  serviceProvider$ = this.systemConfigHousingCoordinationFacade.serviceProvider$; 
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationFacade: SystemConfigHousingCoordinationFacade) { }


 
  loadServiceProviderList(data: any){
    this.systemConfigHousingCoordinationFacade.loadServiceProviderList();
  }
}
