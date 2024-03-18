import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-index-page',
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPageComponent {
  state!: State;
  sortType = this.systemConfigFinancialFacade.sortType;
  pageSizes = this.systemConfigFinancialFacade.gridPageSizes;
  gridSkipCount = this.systemConfigFinancialFacade.skipCount;
  sortValueIndex = this.systemConfigFinancialFacade.sortValueIndex;
  sortIndexGrid = this.systemConfigFinancialFacade.sortIndexGrid;
  indexService$ = this.systemConfigFinancialFacade.loadIndexListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) { }


 
  loadIndexLists(data: any){
    this.systemConfigFinancialFacade.loadIndexLists();
  }
}
