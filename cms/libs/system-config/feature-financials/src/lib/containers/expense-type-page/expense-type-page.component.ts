import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-expense-type-page',
  templateUrl: './expense-type-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseTypePageComponent {
  state!: State;
  sortType = this.systemConfigFinancialFacade.sortType;
  pageSizes = this.systemConfigFinancialFacade.gridPageSizes;
  gridSkipCount = this.systemConfigFinancialFacade.skipCount;
  sortValueExpenseType = this.systemConfigFinancialFacade.sortValueExpenseType;
  sortExpenseTypeGrid = this.systemConfigFinancialFacade.sortExpenseTypeGrid;
  expenseTypeService$ = this.systemConfigFinancialFacade.loadExpenseTypeListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) { }


 
  loadExpenseTypeLists(data: any){
    this.systemConfigFinancialFacade.loadExpenseTypeLists();
  }
  
}
