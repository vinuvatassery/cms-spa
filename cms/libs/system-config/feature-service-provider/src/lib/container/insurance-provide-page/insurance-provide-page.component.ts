import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-insurance-provide-page',
  templateUrl: './insurance-provide-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceProvidePageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueInsuranceProvider = this.systemConfigServiceProviderFacade.sortValueInsProviders;
  sortInsuranceProviderGrid = this.systemConfigServiceProviderFacade.sortInsProvidersGrid;
  insProvidersService$ = this.systemConfigServiceProviderFacade.loadInsuranceProvidersListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadInsuranceProviderLists(data: any){
    this.systemConfigServiceProviderFacade.loadInsuranceProvidersLists();
  }

}
