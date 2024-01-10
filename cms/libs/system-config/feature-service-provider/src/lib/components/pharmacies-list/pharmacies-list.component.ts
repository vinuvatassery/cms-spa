 
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isPharmaciesDetailPopup = false; 
  isPharmaciesDeletePopupShow = false;
  isPharmaciesDeactivatePopupShow = false;
  pharmaciesLists$ = this.systemConfigServiceProviderFacade.loadPharmaciesListsService$;
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
        this.onPharmaciesDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onPharmaciesDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadPharmaciesLists();
  }

  /** Private  methods **/
 
  private loadPharmaciesLists() {
    this.systemConfigServiceProviderFacade.loadPharmaciesLists();
  }

  /** Internal event methods **/
  onClosePharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = false;
  }
  onPharmaciesDetailClicked() {
    this.isPharmaciesDetailPopup = true;
  }

  onClosePharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = false;
  }
  onPharmaciesDeleteClicked() {
    this.isPharmaciesDeletePopupShow = true;
  }
  onClosePharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = false;
  }
  onPharmaciesDeactivateClicked() {
    this.isPharmaciesDeactivatePopupShow = true;
  }
}
