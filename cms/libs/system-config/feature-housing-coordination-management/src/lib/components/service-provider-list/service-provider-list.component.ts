import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { SortDescriptor } from '@progress/kendo-data-query';
@Component({
  selector: 'system-config-service-provider-list',
  templateUrl: './service-provider-list.component.html',
  styleUrls: ['./service-provider-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProviderListComponent implements OnInit {

  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  isServiceProviderDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilServiceProvider$ =
    this.userManagementFacade.clientProfilServiceProvider$;
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
           this.onServiceProviderDetailClicked();
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "Duplicate",
        icon: "copy_all",
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
    this.loadServiceProviderList();
  }
  /** Private methods **/
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadServiceProviderList() {
    this.userManagementFacade.loadServiceProviderList();
  }
   /** Internal event methods **/
   onCloseServiceProviderDetailClicked() {
  this.isServiceProviderDetailPopup = false;
}
onServiceProviderDetailClicked() {
  this.isServiceProviderDetailPopup = true;
}

}
