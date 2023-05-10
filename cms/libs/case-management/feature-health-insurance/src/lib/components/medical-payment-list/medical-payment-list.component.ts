/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { HealthInsurancePolicyFacade, CaseFacade, PaymentRequestType } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-payment-list',
  templateUrl: './medical-payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MedicalPaymentListComponent implements OnInit {

  /** Public **/
  medicalPremiumPayments$ = this.insurancePolicyFacade.premiumPayments$;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isPremiumPaymentDetailsOpened = false;
  @Output() loadPremiumPaymentEvent = new EventEmitter<any>();
  public state!: State;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  @Input() premiumPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  isReadOnly$ = this.caseFacade.isCaseReadOnly$;

  /** Constructor **/

  constructor(private insurancePolicyFacade: HealthInsurancePolicyFacade, private readonly formBuilder: FormBuilder,
    private caseFacade: CaseFacade,
    private lovFacade: LovFacade,) {
    this.premiumPaymentForm = this.formBuilder.group({});
  }
  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };

    this.loadPremiumPaymentData();
  }

  /** Private methods **/

  private loadMedicalPremiumPayments() {
    this.insurancePolicyFacade.loadMedicalPremiumPayments();
  }

  closePremiumPaymentDetailsOpened() {
    this.isPremiumPaymentDetailsOpened = false;
  }
  openPremiumPaymentDetailsOpened() {
    this.getPaymentRequestLov();
    this.isPremiumPaymentDetailsOpened = true;
  }
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPremiumPaymentData();
  }
  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.loadPremiumPaymentData();
  }
  // Loading the grid data based on pagination

  private loadPremiumPaymentData(): void {
    this.loadPremiumPaymentList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0
    );

  }
  loadPremiumPaymentList(
    skipCountValue: number,
    maxResultCountValue: number
  ) {

    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      type: PaymentRequestType.FullPay
    };

    this.loadPremiumPaymentEvent.next(gridDataRefinerValue);
  }
  getPaymentRequestLov() {
    this.lovFacade.getPaymentRequestTypeLov();
    this.lovFacade.getPaymentReversalLov();

  }
}