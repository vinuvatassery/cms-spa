import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-direct-message-page',
  templateUrl: './direct-message-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessagePageComponent {
  

  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueDirectMessageListGrid = this.userManagementFacade.sortValueDirectMessageListGrid;
  sortDirectMessageListGrid = this.userManagementFacade.sortDirectMessageListGrid;
  directMessageLogEvent$ = this.userManagementFacade.directMessageLogEvent$; 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadDirectMessageLists(data: any){
    this.userManagementFacade.loadDirectMessageLogEvent();
  }
 
}
