import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SystemConfigOtherListsFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-assister-groups-page',
  templateUrl: './assister-groups-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssisterGroupsPageComponent {

  state!: State;
  sortType = this.systemConfigOtherListsFacade.sortType;
  pageSizes = this.systemConfigOtherListsFacade.gridPageSizes;
  gridSkipCount = this.systemConfigOtherListsFacade.skipCount;
  sortValueAssisterGroup = this.systemConfigOtherListsFacade.sortValueAssisterGroup;
  sortAssisterGroupGrid = this.systemConfigOtherListsFacade.sortAssisterGroupGrid;
  assisterGroupService$ = this.systemConfigOtherListsFacade.loadAssisterGroupsListsService$; 
  /** Constructor **/
  constructor(private readonly systemConfigOtherListsFacade: SystemConfigOtherListsFacade) { }


 
  loadAssisterGroupLists(data: any){
    this.systemConfigOtherListsFacade.loadAssisterGroupsLists();
  }

}
