import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-funds-page',
  templateUrl: './funds-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundsPageComponent {

  state!: State;
  sortType = this.systemConfigFinancialFacade.sortType;
  pageSizes = this.systemConfigFinancialFacade.gridPageSizes;
  gridSkipCount = this.systemConfigFinancialFacade.skipCount;
  sortValueFunds = this.systemConfigFinancialFacade.sortValueFunds;
  sortFundsGrid = this.systemConfigFinancialFacade.sortFundsGrid;
  fundsService$ = this.systemConfigFinancialFacade.loadFundsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) { }


 
  loadFundsLists(data: any){
    this.systemConfigFinancialFacade.loadFunds();
  }
}
