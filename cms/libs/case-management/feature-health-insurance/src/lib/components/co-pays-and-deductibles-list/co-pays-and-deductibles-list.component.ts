/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import {  HealthInsurancePolicyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-co-pays-and-deductibles-list',
  templateUrl: './co-pays-and-deductibles-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoPaysAndDeductiblesListComponent implements OnInit {
  /** Public properties **/
  coPaysAndDeductibles$ = this.insurancePolicyFacade.coPaysAndDeductibles$;
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
  isCoPaymentDetailsOpened = false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 

  @Input() copayPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;
  
  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly formBuilder: FormBuilder,private readonly cdr: ChangeDetectorRef,private caseFacade: CaseFacade) {
   this.copayPaymentForm = this.formBuilder.group({});
 }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCoPaysAndDeductibles();
  }

  /** Private methods **/
  private loadCoPaysAndDeductibles() {
    this.insurancePolicyFacade.loadCoPaysAndDeductibles();
  }
  openCoPaymentDetailsOpened(){
    this.isCoPaymentDetailsOpened = true;
  }
  closeCoPaymentDetailsOpened(){
    this.isCoPaymentDetailsOpened = false;
  }
}
