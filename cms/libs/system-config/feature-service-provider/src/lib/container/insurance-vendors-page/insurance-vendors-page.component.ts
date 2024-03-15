import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-insurance-vendors-page',
  templateUrl: './insurance-vendors-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceVendorsPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueInsVendors = this.systemConfigServiceProviderFacade.sortValueInsVendors;
  sortInsVendorsGrid = this.systemConfigServiceProviderFacade.sortInsVendorsGrid;
  insVendorsService$ = this.systemConfigServiceProviderFacade.loadInsuranceVendorsListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }
 
  loadInsVendorsLists(data: any){
    this.systemConfigServiceProviderFacade.loadInsuranceVendorsLists();
  }

}
