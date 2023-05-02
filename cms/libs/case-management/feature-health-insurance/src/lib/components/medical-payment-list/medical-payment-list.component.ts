/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsurancePolicyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-payment-list',
  templateUrl: './medical-payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentListComponent implements OnInit {
  /** Public **/
  medicalPremiumPayments$ = this.insurancePolicyFacade.medicalPremiumPayments$;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  isPremiumPaymentDetailsOpened = false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  /** Constructor **/
  constructor(private insurancePolicyFacade: HealthInsurancePolicyFacade,private caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadMedicalPremiumPayments();
  }

  /** Private methods **/
  private loadMedicalPremiumPayments() {
    this.insurancePolicyFacade.loadMedicalPremiumPayments();
  }
  closePremiumPaymentDetailsOpened(){
    this.isPremiumPaymentDetailsOpened = false;
  }

 openPremiumPaymentDetailsOpened(){
    this.isPremiumPaymentDetailsOpened = true;
  }
}
