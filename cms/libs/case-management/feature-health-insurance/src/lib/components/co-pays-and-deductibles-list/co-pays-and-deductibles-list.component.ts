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
  isCoPaymentDetailsOpened = false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 

  @Input() copayPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;

  @Output() loadCoPayEvent  = new EventEmitter<any>();

  public state!: State;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  
  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly formBuilder: FormBuilder,private readonly cdr: ChangeDetectorRef,private caseFacade: CaseFacade) {
   this.copayPaymentForm = this.formBuilder.group({});
 }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadCoPayDeductiblesData();
  }

  /** Private methods **/

  openCoPaymentDetailsOpened(){
    this.isCoPaymentDetailsOpened = true;
  }
  closeCoPaymentDetailsOpened(){
    this.isCoPaymentDetailsOpened = false;
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadCoPayDeductiblesData();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.loadCoPayDeductiblesData();
  }

   // Loading the grid data based on pagination
   private loadCoPayDeductiblesData(): void {
    this.loadCoPayDeductiblesList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0
    );
  }

  loadCoPayDeductiblesList(
    skipCountValue: number,
    maxResultCountValue: number
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      tabId: this.tabStatus
    };
    this.loadCoPayEvent.next(gridDataRefinerValue);
  }
}
