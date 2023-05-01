/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import {  HealthInsurancePolicyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade, private caseFacade: CaseFacade) {}

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
