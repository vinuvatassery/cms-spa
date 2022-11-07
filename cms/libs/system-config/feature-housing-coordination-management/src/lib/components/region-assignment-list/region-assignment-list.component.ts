import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-region-assignment-list',
  templateUrl: './region-assignment-list.component.html',
  styleUrls: ['./region-assignment-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegionAssignmentListComponent implements OnInit {
  isRegionAssignmentDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilRegionAssignment$ =
    this.userManagementFacade.clientProfilRegionAssignment$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';

    public pageSize = 10;
    public skip = 0;
    public pageSizes = [
      {text: '5', value: 5}, 
      {text: '10', value: 10},
      {text: '20', value: 20},
      {text: 'All', value: 100}
    ];

    public sort: SortDescriptor[] = [];
    gridConfiguration = {
      pageSize: 10,
      skip: 0,
      pageable: true,
      reorderable: true,
      resizable: true,
      sortable: true,
      sort: this.sort,
      columnMenu: true,
      pageChange: 0.55,
    };
  
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
