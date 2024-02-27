import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-region-assignment-list',
  templateUrl: './region-assignment-list.component.html',
  styleUrls: ['./region-assignment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionAssignmentListComponent implements OnInit {

  isRegionAssignmentDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileRegionAssignment$ =
    this.userManagementFacade.clientProfileRegionAssignment$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();

    public pageSize = 10;
    public skip = 0;
    public pageSizes = [
      {text: '5', value: 5}, 
      {text: '10', value: 10},
      {text: '20', value: 20},
      {text: 'All', value: 100}
    ];

 
    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
          this.onRegionAssignmentDetailClicked();
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "Deactivate",
        icon: "block",
        click: (): void => {
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
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadRegionAssignmentList();
  }
   /** Private methods **/
   private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadRegionAssignmentList() {
    this.userManagementFacade.loadRegionAssignmentList();
  }
   /** Internal event methods **/
   onCloseRegionAssignmentDetailClicked() {
  this.isRegionAssignmentDetailPopup = false;
}
onRegionAssignmentDetailClicked() {
  this.isRegionAssignmentDetailPopup = true;
}

}
