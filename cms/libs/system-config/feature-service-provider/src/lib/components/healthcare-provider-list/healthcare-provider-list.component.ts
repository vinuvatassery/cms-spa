import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

 
@Component({
  selector: 'system-config-healthcare-provider-list',
  templateUrl: './healthcare-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isHealthcareProvidersDetailPopup = false; 
  isHealthcareProvidersDeletePopupShow = false;
  isHealthcareProvidersDeactivatePopupShow = false;
  indexLists$ = this.systemConfigServiceProviderFacade.loadHealthcareProvidersListsService$;
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
        this.onHealthcareProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onHealthcareProvidersDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadHealthcareProvidersLists();
  }

  /** Private  methods **/
 
  private loadHealthcareProvidersLists() {
    this.systemConfigServiceProviderFacade.loadHealthcareProvidersLists();
  }

  /** Internal event methods **/
  onCloseHealthcareProvidersDetailClicked() {
    this.isHealthcareProvidersDetailPopup = false;
  }
  onHealthcareProvidersDetailClicked() {
    this.isHealthcareProvidersDetailPopup = true;
  }

  onCloseHealthcareProvidersDeleteClicked() {
    this.isHealthcareProvidersDeletePopupShow = false;
  }
  onHealthcareProvidersDeleteClicked() {
    this.isHealthcareProvidersDeletePopupShow = true;
  }
  onCloseHealthcareProvidersDeactivateClicked() {
    this.isHealthcareProvidersDeactivatePopupShow = false;
  }
  onHealthcareProvidersDeactivateClicked() {
    this.isHealthcareProvidersDeactivatePopupShow = true;
  }
}
