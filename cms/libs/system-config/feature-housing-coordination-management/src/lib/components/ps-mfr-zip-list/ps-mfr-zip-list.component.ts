import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-ps-mfr-zip-list',
  templateUrl: './ps-mfr-zip-list.component.html',
  styleUrls: ['./ps-mfr-zip-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsMfrZipListComponent implements OnInit {


  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  isPSMFRZIPDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilePSMFRZIP$ =
    this.userManagementFacade.clientProfilePSMFRZIP$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public formUiStyle : UIFormStyle = new UIFormStyle();

    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onPSMFRZIPDetailClicked();
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "Deactivate",
        icon: "block",
        click: (): void => {
       //  this.onPronounsDeactivateClicked()
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
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadPSMFRZIPList();
  }
 /** Private methods **/
 private loadDdlColumnFilters() {
  this.userManagementFacade.loadDdlColumnFilters();
}

private loadPSMFRZIPList() {
  this.userManagementFacade.loadPSMFRZIPList();
}
 /** Internal event methods **/
 onClosePSMFRZIPDetailClicked() {
this.isPSMFRZIPDetailPopup = false;
}
onPSMFRZIPDetailClicked() {
this.isPSMFRZIPDetailPopup = true;
}
}
