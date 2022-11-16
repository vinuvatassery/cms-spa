/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'system-config-pronouns-list',
  templateUrl: './pronouns-list.component.html',
  styleUrls: ['./pronouns-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PronounsListComponent implements OnInit {

  /** Public properties **/
  isPronounsDeactivatePopup = false;
  isPronounsDetailPopup = false;
  clientProfilePronouns$ = this.userManagementFacade.clientProfilePronouns$;
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
       this.onPronounsDeactivateClicked()
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
    this.loadPronounsList();
  }
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }
  private loadPronounsList() {
    this.userManagementFacade.loadPronounsList();
  }


  /** Internal event methods **/
  onClosePronounsDeactivateClicked() {
    this.isPronounsDeactivatePopup = false;
  }
  onPronounsDeactivateClicked() {
    this.isPronounsDeactivatePopup = true;
  }
  onClosePronounsDetailClicked() {
    this.isPronounsDetailPopup = false;
  }
  onPronounsDetailClicked() {
    this.isPronounsDetailPopup = true;
  }
}
