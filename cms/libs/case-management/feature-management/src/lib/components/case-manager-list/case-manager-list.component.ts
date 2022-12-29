/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';


import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-case-manager-list',
  templateUrl: './case-manager-list.component.html',
  styleUrls: ['./case-manager-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerListComponent implements OnInit {


  /** Input properties **/
  @Input()  getCaseManagers$ : any
 
  /** Public properties **/
  public formUiStyle : UIFormStyle = new UIFormStyle(); 

  editButtonEmitted = false;
  removeButttonEmitted = false;
 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Case Manager",
      icon: "edit",
      click: (): void => {
        // this.onmanagerClicked(true);
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove Case Manager",
      icon: "delete",
      click: (): void => {
      //  this.onremoveManagerClicked()
      },
    },
  ];
  /** Constructor **/
  constructor() {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadManagers();
  }

  /** Private methods **/
  private loadManagers() {
   // this.managerFacade.loadManagers();
  }

  onManagerHover(dataItem : any)
  {
///
  }

  onOpenManagerSearchClicked(f : boolean)
  {
///
  }
}
