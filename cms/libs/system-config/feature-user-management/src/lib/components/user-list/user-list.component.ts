/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { PagerPosition, PagerType } from '@progress/kendo-angular-grid/pager/pager-settings';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from "@progress/kendo-angular-dateinputs";
@Component({
  selector: 'system-config-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  
 
 

  usersData$ = this.userManagementFacade.usersData$;
  usersFilterColumn$ = this.userManagementFacade.usersFilterColumn$;
  isUserDetailsPopup = false;
  isUserDeactivatePopup = false;
  isEditUsersData!: boolean;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
 
  public buttonCount = 2;
  public sizes = [10, 20, 50];
 
 

  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
        this.onUserDetailsClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Block",
      icon: "block",
      click: (): void => {
       this.onUserDeactivateClicked()
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

  constructor(private userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadUsersData();
    this.loadUserFilterColumn();
  }

  private loadUsersData() {
    this.userManagementFacade.loadUsersData();
  }

  private loadUserFilterColumn() {
    this.userManagementFacade.loadUserFilterColumn();
  }

  onUserDetailsClosed() {
    this.isUserDetailsPopup = false;
    this.isUserDeactivatePopup = true;
  }
  onUserDetailsClicked(editValue: boolean) {
    this.isUserDetailsPopup = true;
    this.isEditUsersData = editValue;
  }
  onUserDeactivateClosed() {
    this.isUserDeactivatePopup = false;
  }
  onUserDeactivateClicked() {
    this.isUserDeactivatePopup = true;
  }


}
