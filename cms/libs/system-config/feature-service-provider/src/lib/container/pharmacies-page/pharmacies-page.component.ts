import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-pharmacies-page',
  templateUrl: './pharmacies-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesPageComponent {

  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValuePharmacies = this.systemConfigServiceProviderFacade.sortValuePharmacies;
  sortPharmaciesGrid = this.systemConfigServiceProviderFacade.sortPharmaciesGrid;
  pharmaciesService$ = this.systemConfigServiceProviderFacade.loadPharmaciesListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadPharmaciesLists(data: any){
    this.systemConfigServiceProviderFacade.loadPharmaciesLists();
  }
}
