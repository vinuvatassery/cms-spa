 

import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-manufacturers-list',
  templateUrl: './manufacturers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturersListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isManufacturerDetailPopup = false; 
  isManufacturerDeletePopupShow = false;
  isManufacturerDeactivatePopupShow = false;
  indexLists$ = this.systemConfigServiceProviderFacade.loadManufacturerListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onManufacturerDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onManufacturerDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadManufacturerLists();
  }

  /** Private  methods **/
 
  private loadManufacturerLists() {
    this.systemConfigServiceProviderFacade.loadManufacturerLists();
  }

  /** Internal event methods **/
  onCloseManufacturerDetailClicked() {
    this.isManufacturerDetailPopup = false;
  }
  onManufacturerDetailClicked() {
    this.isManufacturerDetailPopup = true;
  }

  onCloseManufacturerDeleteClicked() {
    this.isManufacturerDeletePopupShow = false;
  }
  onManufacturerDeleteClicked() {
    this.isManufacturerDeletePopupShow = true;
  }
  onCloseManufacturerDeactivateClicked() {
    this.isManufacturerDeactivatePopupShow = false;
  }
  onManufacturerDeactivateClicked() {
    this.isManufacturerDeactivatePopupShow = true;
  }
}
