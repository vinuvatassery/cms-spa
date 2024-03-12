import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigOtherListsFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-domain-page',
  templateUrl: './domain-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainPageComponent {

  state!: State;
  sortType = this.systemConfigOtherListsFacade.sortType;
  pageSizes = this.systemConfigOtherListsFacade.gridPageSizes;
  gridSkipCount = this.systemConfigOtherListsFacade.skipCount;
  sortValueDomain = this.systemConfigOtherListsFacade.sortValueDomain;
  sortDomainGrid = this.systemConfigOtherListsFacade.sortDomainGrid;
  domainService$ = this.systemConfigOtherListsFacade.loadDomainsListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigOtherListsFacade: SystemConfigOtherListsFacade) { }


 
  loadDomainLists(data: any){
    this.systemConfigOtherListsFacade.loadDomainsLists();
  }

}
