import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-drugs-page',
  templateUrl: './drugs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueDrugs = this.systemConfigServiceProviderFacade.sortValueDrugs;
  sortDrugsGrid = this.systemConfigServiceProviderFacade.sortDrugsGrid;
  drugsService$ = this.systemConfigServiceProviderFacade.loadDrugsListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadDrugsLists(data: any){
    this.systemConfigServiceProviderFacade.loadDrugsLists();
  }

}
