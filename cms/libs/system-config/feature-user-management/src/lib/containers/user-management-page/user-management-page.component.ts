/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocumentFacade } from '@cms/shared/util-core';
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
  userListProfilePhoto$ = this.userManagementFacade.userListProfilePhotoSubject;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade, private readonly documentFacade: DocumentFacade ) { }


 
  loadUserLists(data: any){
    this.userManagementFacade.loadUsersData(data);
  }
  loadUserGridFilterLists(data: any){
    this.userManagementFacade.loadUserFilterColumn();
  }

  onExportAllUser(event: any){
    this.userManagementFacade.onExportAllUser(event);
  }
}
