/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-insurance-status-list',
  templateUrl: './medical-insurance-status-list.component.html',
  styleUrls: ['./medical-insurance-status-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalInsuranceStatusListComponent implements OnInit {
  /** Public properties **/
  healthInsuranceStatus$ = this.insurancePolicyFacade.healthInsuranceStatus$;
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Copy Status",
      icon: "content_copy",
      click: (): void => {
        // this.onPhoneNumberDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit Status",
      icon: "edit",
      click: (): void => {
      //  this.onDeactivateEmailAddressClicked()
      },
    },
    
   
    
 
  ];

  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthInsuranceStatus();
  }

  /** Private methods **/
  private loadHealthInsuranceStatus() {
    this.insurancePolicyFacade.loadHealthInsuranceStatus();
  }
}
