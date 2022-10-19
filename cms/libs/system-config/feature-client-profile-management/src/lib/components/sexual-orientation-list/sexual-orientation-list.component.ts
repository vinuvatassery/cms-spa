/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'system-config--sexual-orientation-list',
  templateUrl: './sexual-orientation-list.component.html',
  styleUrls: ['./sexual-orientation-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexualOrientationListComponent implements OnInit {
  /** Public properties **/
  isSexualOrientationDeactivatePopup = false;
  isSexualOrientationDetailPopup = false;
  clientProfileSexualOrientation$ = this.userManagementFacade.clientProfileSexualOrientation$;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
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
       this.onSexualOrientationDeactivateClicked()
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
    this.loadSexualOrientationList();
  }


  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }
  private loadSexualOrientationList() {
    this.userManagementFacade.loadSexualOrientationList();
  }
  /** Internal event methods **/
  onCloseSexualOrientationDeactivateClicked() {
    this.isSexualOrientationDeactivatePopup = false;
  }
  onSexualOrientationDeactivateClicked() {
    this.isSexualOrientationDeactivatePopup = true;
  }
  onCloseSexualOrientationDetailClicked() {
    this.isSexualOrientationDetailPopup = false;
  }
  onSexualOrientationDetailClicked() {
    this.isSexualOrientationDetailPopup = true;
  }
}
