import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-roles-and-permissions-list',
  templateUrl: './roles-and-permissions-list.component.html',
  styleUrls: ['./roles-and-permissions-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesAndPermissionsListComponent implements OnInit {
  usersRoleAndPermissions$ = this.userManagementFacade.usersRoleAndPermissions$;
  ddlRolesAndPermissionsFilter$ = this.userManagementFacade.ddlRolesAndPermissionsFilter$;
  isRoleDeactivatePopup = false;
  isSelectRolePopup = false;
  isInternalRole !: boolean;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
        // this.onUserDetailsClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Duplicate",
      icon: "copy_all",
      click: (): void => {
      //  this.onRoleDeactivateClicked()
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Block",
      icon: "block",
      click: (): void => {
       this.onRoleDeactivateClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
      // this.onOpenDeleteTodoClicked()
      },
    },
    
 
  ];

  constructor(private userManagementFacade: UserManagementFacade) {}

  ngOnInit(): void {
    this.loadUsersRoleAndPermissions();
    this.loadDdlRolesAndPermissionsFilter();
  }

  private loadUsersRoleAndPermissions() {
    this.userManagementFacade.loadUsersRoleAndPermissions();
  }

  private loadDdlRolesAndPermissionsFilter() {
    this.userManagementFacade.loadDdlRolesAndPermissionsFilter();
  }

  onCloseRoleDeactivateClicked() {
    this.isSelectRolePopup = false;
  }
  onRoleDeactivateClicked() {
    this.isSelectRolePopup = true;
  }
  onCloseSelectRoleClicked() {
    this.isSelectRolePopup = false;
  }
  onSelectRoleClicked() {
    this.isSelectRolePopup = true;
  }

  onInternalRoleClicked(){
    this.isInternalRole = true;
  }
}
