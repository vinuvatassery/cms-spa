import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-medical-providers-page',
  templateUrl: './medical-providers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProvidersPageComponent {

  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueMedicalProvider = this.systemConfigServiceProviderFacade.sortValueMedicalProvider;
  sortMedicalProviderGrid = this.systemConfigServiceProviderFacade.sortMedicalProviderGrid;
  medicalProviderService$ = this.systemConfigServiceProviderFacade.loadMedicalProvidersListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadMedicalProviderLists(data: any){
    this.systemConfigServiceProviderFacade.loadMedicalProvidersLists();
  }

}
