import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

 

@Component({
  selector: 'system-config-insurance-vendors-list',
  templateUrl: './insurance-vendors-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceVendorsListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isInsuranceVendorsDetailPopup = false; 
  isInsuranceVendorsDeletePopupShow = false;
  isInsuranceVendorsDeactivatePopupShow = false;
  insuranceVendorsList$ = this.systemConfigServiceProviderFacade.loadInsuranceVendorsListsService$;
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
        this.onInsuranceVendorsDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onInsuranceVendorsDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadInsuranceVendorsLists();
  }

  /** Private  methods **/
 
  private loadInsuranceVendorsLists() {
    this.systemConfigServiceProviderFacade.loadInsuranceVendorsLists();
  }

  /** Internal event methods **/
  onCloseInsuranceVendorsDetailClicked() {
    this.isInsuranceVendorsDetailPopup = false;
  }
  onInsuranceVendorsDetailClicked() {
    this.isInsuranceVendorsDetailPopup = true;
  }

  onCloseInsuranceVendorsDeleteClicked() {
    this.isInsuranceVendorsDeletePopupShow = false;
  }
  onInsuranceVendorsDeleteClicked() {
    this.isInsuranceVendorsDeletePopupShow = true;
  }
  onCloseInsuranceVendorsDeactivateClicked() {
    this.isInsuranceVendorsDeactivatePopupShow = false;
  }
  onInsuranceVendorsDeactivateClicked() {
    this.isInsuranceVendorsDeactivatePopupShow = true;
  }
}
