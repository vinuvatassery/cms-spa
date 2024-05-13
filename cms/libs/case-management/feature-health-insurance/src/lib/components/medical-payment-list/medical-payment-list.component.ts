/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';

/** External **/
import { Subject, Subscription } from 'rxjs';

/** Facades **/
import {
  HealthInsurancePolicyFacade,
  CaseFacade,
  ClientProfileTabs,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-medical-payment-list',
  templateUrl: './medical-payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentListComponent implements OnInit {
  /** Public **/
  medicalPremiumPayments$ = this.insurancePolicyFacade.premiumPayments$;
  triggeredPremiumPaymentSave$ =
    this.insurancePolicyFacade.triggeredPremiumPaymentSave$;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isPremiumPaymentDetailsOpened = false;
  @Output() loadPremiumPaymentEvent = new EventEmitter<any>();
  @Output() loadTwelveMonthRecord = new EventEmitter<boolean>();
  public state!: State;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  @Input() healthInsuranceProfilePhoto$!: any;
  isReadOnly$ = this.caseFacade.isCaseReadOnly$;
  showTwelveMonthRecordFlag: boolean = true;
  carrierContactInfo!: any;
  sort!: any;
  /** Private **/
  private triggeredPremiumPaymentSubscription!: Subscription;
  insurancePremiumProfilePhotoSubject = new Subject();
  insurancePremiumProfilePhotoSubscription = new Subscription();
  //insurancePremiumProfilePhoto$ = this.insurancePolicyFacade.insurancePremiumProfilePhotoSubject;

  /** Constructor **/

  constructor(
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly formBuilder: FormBuilder,
    private caseFacade: CaseFacade,
    private lovFacade: LovFacade
  ) {}
  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
    };
    this.loadPremiumPaymentData();
    this.registerTriggeredPremiumPaymentSubscription();
  }

  ngOnDestroy(): void {
    this.triggeredPremiumPaymentSubscription.unsubscribe();
    this.insurancePremiumProfilePhotoSubscription?.unsubscribe();
  }
  /** Private methods **/

  private loadMedicalPremiumPayments() {
    this.insurancePolicyFacade.loadMedicalPremiumPayments();
  }

  handleShowHistoricalClick() {
    this.loadPremiumPaymentData();
  }

  closePremiumPaymentDetailsOpened() {
    this.isPremiumPaymentDetailsOpened = false;
  }
  closePremiumPaymentEventTriggered(event: any) {
    if (event) {
      this.closePremiumPaymentDetailsOpened();
    }
  }
  openPremiumPaymentDetailsOpened() {
    this.getPaymentRequestLov();
    this.isPremiumPaymentDetailsOpened = true;
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort = { field: 'paymentRequestId', dir: 'asc' };
    this.loadPremiumPaymentData();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.sort = {
      field: stateData?.sort[0]?.field ?? 'paymentRequestId',
      dir: stateData?.sort[0]?.dir ?? 'asc',
    };
    this.loadPremiumPaymentData();
  }
  private loadPremiumPaymentData(): void {
    this.loadPremiumPaymentList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sort?.field ?? 'paymentRequestId',
      this.sort?.dir ?? 'asc'
    );
  }

  private registerTriggeredPremiumPaymentSubscription() {
    this.triggeredPremiumPaymentSubscription =
      this.triggeredPremiumPaymentSave$.subscribe((data) => {
        if (data) {
          this.closePremiumPaymentDetailsOpened();
          this.loadPremiumPaymentData();
        }
      });
  }

  loadPremiumPaymentList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortColumn: any,
    sortType: any
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      sortColumn: sortColumn,
      sortType: sortType,
      type: 'MEDICAL_PREMIUM',
      dentalPlanFlag:
        this.tabStatus == ClientProfileTabs.HEALTH_INSURANCE_PREMIUM_PAYMENTS
          ? ClientProfileTabs.HEALTH_INSURANCE_STATUS
          : ClientProfileTabs.DENTAL_INSURANCE_STATUS,
      twelveMonthsRecords: this.showTwelveMonthRecordFlag,
    };

    this.loadPremiumPaymentEvent.next(gridDataRefinerValue);
  }

  getPaymentRequestLov() {
    this.lovFacade.getPremiumPaymentTypeLov();
    this.lovFacade.getPremiumPaymentReversalLov();
  }

  getCarrierContactInfo(carrierId: string) {
    this.carrierContactInfo = '';
    this.insurancePolicyFacade.getCarrierContactInfo(carrierId).subscribe({
      next: (data) => {
        this.carrierContactInfo = data;
      },
      error: (err) => {
        if (err) {
          this.insurancePolicyFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
  }
}
