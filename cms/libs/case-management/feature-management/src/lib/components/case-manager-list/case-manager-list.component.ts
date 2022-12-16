/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-case-manager-list',
  templateUrl: './case-manager-list.component.html',
  styleUrls: ['./case-manager-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerListComponent implements OnInit {
  /** Public properties **/
  managers$ = this.managerFacade.managers$;
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Case Manager",
      icon: "edit",
      click: (): void => {
        // this.onOpenProviderClicked(true);
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Case Manager",
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
  ];
  /** Constructor **/
  constructor(private readonly managerFacade: ManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadManagers();
  }

  /** Private methods **/
  private loadManagers() {
    this.managerFacade.loadManagers();
  }
}
