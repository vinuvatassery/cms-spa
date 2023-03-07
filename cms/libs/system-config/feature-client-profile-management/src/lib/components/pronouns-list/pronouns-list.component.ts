/** Angular **/
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
      text: "Reorder",
      icon: "format_list_numbered",
      click: (): void => {
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
