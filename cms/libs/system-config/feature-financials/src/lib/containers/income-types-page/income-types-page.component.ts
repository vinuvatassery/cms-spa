import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-income-types-page',
  templateUrl: './income-types-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeTypesPageComponent {
  state!: State;
  sortType = this.systemConfigFinancialFacade.sortType;
  pageSizes = this.systemConfigFinancialFacade.gridPageSizes;
  gridSkipCount = this.systemConfigFinancialFacade.skipCount;
  sortValueIncomeType = this.systemConfigFinancialFacade.sortValueIncomeType;
  sortIncomeTypeGrid = this.systemConfigFinancialFacade.sortIncomeTypeGrid;
  incomeTypeService$ = this.systemConfigFinancialFacade.loadIncomeTypeListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) { }


 
  loadIncomeTypeLists(data: any){
    this.systemConfigFinancialFacade.loadIncomeTypeLists();
  }
}
