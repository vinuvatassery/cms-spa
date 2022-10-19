/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-medical-insurance-status-list',
  templateUrl: './medical-insurance-status-list.component.html',
  styleUrls: ['./medical-insurance-status-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalInsuranceStatusListComponent implements OnInit {
  /** Public properties **/
  healthInsuranceStatus$ = this.healthFacade.healthInsuranceStatus$;
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
  constructor(private readonly healthFacade: HealthInsuranceFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthInsuranceStatus();
  }

  /** Private methods **/
  private loadHealthInsuranceStatus() {
    this.healthFacade.loadHealthInsuranceStatus();
  }
}
