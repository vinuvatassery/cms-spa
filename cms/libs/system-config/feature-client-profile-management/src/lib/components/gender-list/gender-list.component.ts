/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'system-config-gender-list',
  templateUrl: './gender-list.component.html',
  styleUrls: ['./gender-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GenderListComponent implements OnInit {
  /** Public properties **/
  isGenderDeactivatePopup = false;
  isGenderDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileGender$ = this.userManagementFacade.clientProfileGender$;
 
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
      text: "Reorder",
      icon: "format_list_numbered",
      click: (): void => {
      //  this.onUserDeactivateClicked()
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (): void => {
       this.onGenderDeactivateClicked()
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

  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
  
    this.loadDdlColumnFilters();
    this.loadGenderList();
  }
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadGenderList() {
    this.userManagementFacade.loadGenderList();
  }

  /** Internal event methods **/
  onCloseGenderDeactivateClicked() {
    this.isGenderDeactivatePopup = false;
  }
  onGenderDeactivateClicked() {
    this.isGenderDeactivatePopup = true;
  }
  onCloseGenderDetailClicked() {
    this.isGenderDetailPopup = false;
  }
  onGenderDetailClicked() {
    this.isGenderDetailPopup = true;
  }
}
