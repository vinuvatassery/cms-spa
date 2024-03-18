import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-roles-and-permissions-page',
  templateUrl: './roles-and-permissions-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesAndPermissionsPageComponent {


  state!: State;
  sortType = this.userManagementFacade.sortType;
  pageSizes = this.userManagementFacade.gridPageSizes;
  gridSkipCount = this.userManagementFacade.skipCount;
  sortValueRolesPermissionListGrid = this.userManagementFacade.sortValueRolesPermissionListGrid;
  sortRolesPermissionListGrid = this.userManagementFacade.sortRolesPermissionListGrid;
  usersRoleAndPermissions$ = this.userManagementFacade.usersRoleAndPermissions$;
  ddlRolesAndPermissionsFilter$ = this.userManagementFacade.ddlRolesAndPermissionsFilter$;
 
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


 
  loadUsersRoleAndPermissions(data: any){
    this.userManagementFacade.loadUsersRoleAndPermissions();
  }
  loadDdlRolesAndPermissionsFilter(data: any){
    this.userManagementFacade.loadDdlRolesAndPermissionsFilter();
  }

}
