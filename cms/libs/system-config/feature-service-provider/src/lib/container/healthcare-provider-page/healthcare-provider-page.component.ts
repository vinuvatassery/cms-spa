import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueHealthcareProvider = this.systemConfigServiceProviderFacade.sortValueHealthcareProvider;
  sortHealthcareProviderGrid = this.systemConfigServiceProviderFacade.sortHealthcareProviderGrid;
  healthcareProviderService$ = this.systemConfigServiceProviderFacade.loadHealthcareProvidersListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadHealthcareProviderLists(data: any){
    this.systemConfigServiceProviderFacade.loadHealthcareProvidersLists();
  }
}
