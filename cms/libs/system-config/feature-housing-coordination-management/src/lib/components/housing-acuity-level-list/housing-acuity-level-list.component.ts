import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-housing-acuity-level-list',
  templateUrl: './housing-acuity-level-list.component.html',
  styleUrls: ['./housing-acuity-level-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HousingAcuityLevelListComponent implements OnInit {

  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
   /** Public properties **/
   isHousingAcuityLevelDetailPopup = false;
   ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
   clientProfileHousingAcuityLevel$ = this.userManagementFacade.clientProfileHousingAcuityLevel$;
   popupClassAction = 'TableActionPopup app-dropdown-action-list';


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
        this.onHousingAcuityLevelDetailClicked();
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
    this.loadHousingAcuityLevelList();
  }
  /** Private methods **/
   private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadHousingAcuityLevelList() {
    this.userManagementFacade.loadHousingAcuityLevelList();
  }

  /** Internal event methods **/
  onCloseHousingAcuityLevelDetailClicked() {
    this.isHousingAcuityLevelDetailPopup = false;
  }
  onHousingAcuityLevelDetailClicked() {
    this.isHousingAcuityLevelDetailPopup = true;
  }

}
