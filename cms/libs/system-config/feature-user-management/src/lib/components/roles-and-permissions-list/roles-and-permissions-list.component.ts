import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  public formUiStyle : UIFormStyle = new UIFormStyle();

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Duplicate",
      icon: "copy_all",
      click: (): void => {
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
