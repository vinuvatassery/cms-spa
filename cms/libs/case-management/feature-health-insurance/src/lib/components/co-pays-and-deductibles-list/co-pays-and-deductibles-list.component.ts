/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import {  HealthInsurancePolicyFacade, CaseFacade, ClientProfileTabs} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-co-pays-and-deductibles-list',
  templateUrl: './co-pays-and-deductibles-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoPaysAndDeductiblesListComponent implements OnInit, OnDestroy {

  /** Public properties **/

  coPaysAndDeductibles$ = this.insurancePolicyFacade.coPaysAndDeductibles$;
  triggeredCoPaySave$ = this.insurancePolicyFacade.triggeredCoPaySave$
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isCoPaymentDetailsOpened = false;
  isReadOnly$ = this.caseFacade.isCaseReadOnly$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() copayPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  @Output() loadCoPayEvent = new EventEmitter<any>();
  public state!: State;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  carrierContactInfo!: any;
  sort!: any; 
  clientmaxmumbalance:number=0;
  groupValue = null;
  statusValue = null;
  serviceDescription="Medical";
  coPaymentProfilePhotoSubject = new Subject();
  coPaymentProfilePhotoSubscription = new Subscription();
  triggeredCoPaySaveSubscription = new Subscription();
  coPaymentProfilePhoto$ = this.insurancePolicyFacade.coPaymentProfilePhotoSubject;
  /** Constructor **/
  constructor(private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly formBuilder: FormBuilder, private readonly cdr: ChangeDetectorRef, private caseFacade: CaseFacade,
    private lovFacade: LovFacade,) {
    this.copayPaymentForm = this.formBuilder.group({});
  }
  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.insurancePolicyFacade.getMedicalClaimMaxbalance(this.clientId,this.caseEligibilityId);
   this.insurancePolicyFacade.clientmaxmumbalance$.subscribe((res:any)=>{    
   this.clientmaxmumbalance=res?.maximumAmount;
   if(this.tabStatus != ClientProfileTabs.HEALTH_INSURANCE_COPAY )
   {
    this.serviceDescription="Dental";
    this.cdr.detectChanges();
   }
   })
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadCoPayDeductiblesData();
    this.triggeredCoPaySaveSubscription = this.triggeredCoPaySave$.subscribe(data=>{
      if(data){
        this.closeCoPaymentDetailsOpened();
        this.loadCoPayDeductiblesData();
      }
    })
  }

  ngOnDestroy(): void {
    this.triggeredCoPaySaveSubscription?.unsubscribe();
  }

  /** Private methods **/
  openCoPaymentDetailsOpened() {
    this.getPaymentRequestLov();
    this.isCoPaymentDetailsOpened = true;
  }

  closeCoPaymentDetailsOpened() {
    this.isCoPaymentDetailsOpened = false;
  }
  closeCoPaymentTriggered(event: any){
    if(event){
      this.closeCoPaymentDetailsOpened()
    }

  }
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort = { field: 'paymentRequestId', dir: 'asc' };
    this.loadCoPayDeductiblesData();
  }
  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.sort = { field: stateData?.sort[0]?.field ?? 'paymentRequestId', dir: stateData?.sort[0]?.dir ?? 'asc' };
    this.loadCoPayDeductiblesData();
  }

  // Loading the grid data based on pagination

  private loadCoPayDeductiblesData(): void {
    
    this.loadCoPayDeductiblesList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sort?.field ?? 'paymentRequestId',
      this.sort?.dir ?? 'asc'
    );
  }

  loadCoPayDeductiblesList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortColumn: any,
    sortType: any,
  ) 
  {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      type: 'COPAYMENT',
      sortColumn: sortColumn,
      sortType: sortType,
      dentalPlanFlag: (this.tabStatus == ClientProfileTabs.HEALTH_INSURANCE_COPAY ) ? ClientProfileTabs.HEALTH_INSURANCE_STATUS : ClientProfileTabs.DENTAL_INSURANCE_STATUS,
      twelveMonthsRecords: false
    };
    this.loadCoPayEvent.next(gridDataRefinerValue);
  }
  getPaymentRequestLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
  }

  getCarrierContactInfo(carrierId:string){
    this.carrierContactInfo='';
    this.insurancePolicyFacade.getCarrierContactInfo(carrierId).subscribe({
      next: (data) => {
        this.carrierContactInfo=data;
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
