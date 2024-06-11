import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-manufacturers-page',
  templateUrl: './manufacturers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturersPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueManufacturer = this.systemConfigServiceProviderFacade.sortValueManufacturer;
  sortManufacturerGrid = this.systemConfigServiceProviderFacade.sortManufacturerGrid;
  manufacturersList$ = this.systemConfigServiceProviderFacade.loadManufacturerListsService$; 
  paymentAddressProfilePhoto$ = this.systemConfigServiceProviderFacade.systemConfigProfilePhotoSubject;
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadManufacturerLists(data: any){
    this.systemConfigServiceProviderFacade.loadManufacturerLists(data);
  }
}
