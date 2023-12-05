 
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

 

@Component({
  selector: 'system-config-insurance-provide-list',
  templateUrl: './insurance-provide-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceProvideListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isInsuranceProvidersDetailPopup = false; 
  isInsuranceProvidersDeletePopupShow = false;
  isInsuranceProvidersDeactivatePopupShow = false;
  indexLists$ = this.systemConfigServiceProviderFacade.loadInsuranceProvidersListsService$;
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
        this.onInsuranceProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onInsuranceProvidersDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadInsuranceProvidersLists();
  }

  /** Private  methods **/
 
  private loadInsuranceProvidersLists() {
    this.systemConfigServiceProviderFacade.loadInsuranceProvidersLists();
  }

  /** Internal event methods **/
  onCloseInsuranceProvidersDetailClicked() {
    this.isInsuranceProvidersDetailPopup = false;
  }
  onInsuranceProvidersDetailClicked() {
    this.isInsuranceProvidersDetailPopup = true;
  }

  onCloseInsuranceProvidersDeleteClicked() {
    this.isInsuranceProvidersDeletePopupShow = false;
  }
  onInsuranceProvidersDeleteClicked() {
    this.isInsuranceProvidersDeletePopupShow = true;
  }
  onCloseInsuranceProvidersDeactivateClicked() {
    this.isInsuranceProvidersDeactivatePopupShow = false;
  }
  onInsuranceProvidersDeactivateClicked() {
    this.isInsuranceProvidersDeactivatePopupShow = true;
  }
}
