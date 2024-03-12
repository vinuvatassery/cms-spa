import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-insurance-plan-page',
  templateUrl: './insurance-plan-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurancePlanPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueInsurancePlan = this.systemConfigServiceProviderFacade.sortValueInsurancePlans;
  sortInsurancePlanGrid = this.systemConfigServiceProviderFacade.sortInsurancePlansGrid;
  insurancePlanService$ = this.systemConfigServiceProviderFacade.loadInsurancePlansListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadInsurancePlanLists(data: any){
    this.systemConfigServiceProviderFacade.loadInsurancePlansLists();
  }
}
