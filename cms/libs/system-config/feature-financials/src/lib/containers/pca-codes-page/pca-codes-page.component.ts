import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-pca-codes-page',
  templateUrl: './pca-codes-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcaCodesPageComponent {
  state!: State;
  sortType = this.systemConfigFinancialFacade.sortType;
  pageSizes = this.systemConfigFinancialFacade.gridPageSizes;
  gridSkipCount = this.systemConfigFinancialFacade.skipCount;
  sortValuePcaCodes = this.systemConfigFinancialFacade.sortValuePcaCode;
  sortPcaCodesGrid = this.systemConfigFinancialFacade.sortPcaCodeGrid;
  pcaCodesService$ = this.systemConfigFinancialFacade.loadPcaCodeListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) { }


 
  loadPcaCodeLists(data: any){
    this.systemConfigFinancialFacade.loadPcaCodeLists();
  }
}
