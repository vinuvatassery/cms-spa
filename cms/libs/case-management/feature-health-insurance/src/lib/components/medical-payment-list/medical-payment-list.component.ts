/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { HealthInsurancePolicyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
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
 
  @Input() premiumPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;
   isReadOnly$=this.caseFacade.isCaseReadOnly$;
  /** Constructor **/
  constructor(private insurancePolicyFacade: HealthInsurancePolicyFacade,private readonly formBuilder: FormBuilder,
    private caseFacade: CaseFacade) {
    this.premiumPaymentForm = this.formBuilder.group({});
  }

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
