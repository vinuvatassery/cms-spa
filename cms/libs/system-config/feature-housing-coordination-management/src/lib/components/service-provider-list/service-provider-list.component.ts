import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  clientProfileServiceProvider$ =
    this.userManagementFacade.clientProfileServiceProvider$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public formUiStyle : UIFormStyle = new UIFormStyle();
 
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
