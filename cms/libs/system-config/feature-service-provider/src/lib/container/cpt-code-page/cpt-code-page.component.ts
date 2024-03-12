import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-cpt-code-page',
  templateUrl: './cpt-code-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodePageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueCptCode = this.systemConfigServiceProviderFacade.sortValueCptCode;
  sortCptCodeGrid = this.systemConfigServiceProviderFacade.sortCptCodeGrid;
  cptCodeService$ = this.systemConfigServiceProviderFacade.loadCptCodeListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) { }


 
  loadCptCodeLists(data: any){
    this.systemConfigServiceProviderFacade.loadCptCodeLists();
  }

}
