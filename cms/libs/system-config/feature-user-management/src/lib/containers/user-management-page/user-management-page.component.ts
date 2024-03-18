/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-user-management-page',
  templateUrl: './user-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent {
  /** Public properties **/
  users$ = this.userManagementFacade.users$;
  isInnerLeftMenuOpen = false;

  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueUserListGrid = this.userManagementFacade.sortValueUserListGrid;
  sortUserListGrid = this.userManagementFacade.sortUserListGrid;
  usersDataLists$ = this.userManagementFacade.usersData$;
  usersFilterColumn$ = this.userManagementFacade.usersFilterColumn$;
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadUserLists(data: any){
    this.userManagementFacade.loadUsersData();
  }
  loadUserGridFilterLists(data: any){
    this.userManagementFacade.loadUserFilterColumn();
  }
}
