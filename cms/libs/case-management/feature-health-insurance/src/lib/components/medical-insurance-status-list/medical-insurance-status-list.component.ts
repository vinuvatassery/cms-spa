/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { HealthInsurancePolicyFacade, CaseFacade, InsuranceStatusType, ClientFacade, PriorityCode} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { Subscription } from 'rxjs';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { FilterService } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'case-management-medical-insurance-status-list',
  templateUrl: './medical-insurance-status-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MedicalInsuranceStatusListComponent implements OnInit,OnDestroy {

   /** Private properties **/
  private dentalInsuranceListSubscription!: Subscription;
  /** Public properties **/
  healthInsuranceStatus$ = this.insurancePolicyFacade.healthInsuranceStatus$;
  medicalHealthPlans$ = this.insurancePolicyFacade.medicalHealthPlans$;
  isCopyInsuranceConfirm = false;
  medicalHealthPlansCount :any;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isOpenedHealthInsuranceModal:boolean= false;
  insurancePriorityModalButtonText = 'Save';
  insuranceType!: string;
  dialogTitle!: string;
  @Input() healthInsuranceForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() insuranceStatus:any;
  @Input() closeDeleteModal: boolean = false;
  @Output() loadInsurancePlanEvent = new EventEmitter<any>();
  @Output() deleteInsurancePlan = new EventEmitter<any>();
  @Output() loadHistoricalPlan = new EventEmitter<boolean>();
  @Output() getPoliciesEventEmitter = new EventEmitter<any>();
  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  priorityCodeType$ = this.lovFacade.priorityCodeType$;
  showHistoricalFlag:boolean = true;
  carrierContactInfo:any;
  insurancePlanName:any;
  insuranceStatusType:any;
  isEdit!: boolean;
  currentInsurancePolicyId:any;
  isPaymentDone:any;
  isTriggerPriorityPopup = false;
  isOpenedChangePriorityModal:boolean= false;
  isEditInsurancePriorityTitle = false;
  selectedInsurance: any;
  selectedEligibilityId:any;
  selectedPolicyPriority:any=null;
  public state!: State;
  sort!:any;
  filter!: any;
  sortValue:any ='healthInsuranceTypeDesc';
  sortType:any='asc';
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  isOpenedDeleteConfirm:boolean = false;
  buttonText:string ="MEDICAL INSURANCE";
  healthInsuranceTypeDesc:any;
  priorityDesc:any;
  premiumFrequencyDesc:any;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  insuranceStatusProfilePhotoSubject = new Subject();
  medicalHealthProfilePhoto$ = this.insurancePolicyFacade.medicalHealthProfilePhotoSubject;
  careassistPayingPremiumFlagValue:any;
  otherCoveredOnPlanValue:any;
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  yesOrNoLovs: any = [];
  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Copy Insurance",
      icon: "content_copy",
      type:"Copy",
      click: (): void => {
        this.handleHealthInsuranceOpenClicked('copy');
      }
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit Insurance",
      icon: "edit",
      type:"Edit",
      click: (): void => {
        this.handleHealthInsuranceOpenClicked('edit');
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Insurance",
      icon: "delete",
      type: "Delete",
      click: (): void => {
      },
    }

  ];

  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade,
     private readonly formBuilder: FormBuilder,private readonly cdr: ChangeDetectorRef, private caseFacade: CaseFacade,
     private readonly clientFacade: ClientFacade, private lovFacade: LovFacade,
     private readonly userManagementFacade: UserManagementFacade) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadYesOrNoLovsInit();
    this.lovFacade.getYesOrNoLovs();
    this.state = {
      skip: this.insurancePolicyFacade.skipCount,
      take: this.insurancePolicyFacade.gridPageSizes[0]?.value
    };
    this.sort ={ field : 'creationTime' ,  dir: 'asc' };
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) { 
      this.loadDentalInsuranceLovs();
    }
    else {
      this.loadHealthInsuranceLovs();
    }
    this.loadInsurancePolicies();
    if (this.insuranceStatus != InsuranceStatusType.dentalInsurance) {
      this.buttonText ="MEDICAL INSURANCE";
      this.gridOptionData.push({
        buttonType: "btn-h-primary",
        text: "Change Priority",
        icon: "format_line_spacing",
        type: "priority",
        click: (): void => {},
      })
    }
    else{
      this.buttonText ="DENTAL INSURANCE";
    }
    this.priorityPopupShowSubscription();
    this.dentalInsuranceListSubscription =  this.medicalHealthPlans$.subscribe((medicalHealthPolicy:any)=>{
      this.medicalHealthPlansCount = medicalHealthPolicy?.data?.length;
      if(this.medicalHealthPlansCount > 0){
        
      }
    })
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    if (this.closeDeleteModal) {
      this.onDeleteConfirmCloseClicked();
      this.handleHealthInsuranceCloseClicked();
    }
  }

  private loadYesOrNoLovsInit() {
    this.yesOrNoLov$
      .subscribe({
        next: (data: any) => {
          this.yesOrNoLovs = data;
        }
      });
  }

  private loadHealthInsuranceLovs() {
    this.lovFacade.getHealthInsuranceTypeLovs();
    this.lovFacade.getPremiumFrequencyLovs();
    this.lovFacade.getCaseCodeLovs();
  }

  private loadDentalInsuranceLovs() {
    this.lovFacade.getDentalInsuranceTypeLovs();
  }

  deleteButtonClicked(deleteButtonClicked: any) {
    if (deleteButtonClicked) {
      this.onDeleteConfirmOpenClicked();
    }
  }

  ngOnDestroy(): void {
    this.dentalInsuranceListSubscription?.unsubscribe();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort ={ field : 'creationTime' ,  dir: 'asc' };
    this.loadInsurancePolicies();
  }

  dropdownFilterChange(field: string, value: any, filterService: FilterService): void {
    let valueSet = value.lovDesc;;
    if (field == "healthInsuranceTypeDesc") {
      this.healthInsuranceTypeDesc = value;
    }
    if (field == "priorityDesc") {
      this.priorityDesc = value;
    }
    if (field == "premiumFrequencyDesc") {
      this.premiumFrequencyDesc = value;
    }
    if (field == "careassistPayingPremiumFlag") {
      this.careassistPayingPremiumFlagValue = value;
      valueSet = value.lovCode;
    }
    if (field == "otherCoveredOnPlan") {
      this.otherCoveredOnPlanValue = value;
      valueSet = value.lovCode;
    }

    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value: valueSet
      }],
      logic: "or"
    });
  }
  
  handleHealthInsuranceOpenClicked(value: string) {
    this.isOpenedHealthInsuranceModal = true;
    switch (value) {
      case 'edit':
        this.dialogTitle = 'Edit';
        this.isEdit = true;
        break;
      case 'add':
        this.dialogTitle = 'Add';
        this.isEdit = false;
        break;
      case 'copy':
        this.dialogTitle = 'Copy';
        this.isEdit = true;
        break;
    }
  }
  handleShowHistoricalClick(){
    if(this.showHistoricalFlag){
      this.loadHistoricalPlan.next(true);
    }
    else{
      this.loadHistoricalPlan.next(false);
    }
  }
  isAddPriority(event:any)
  {
    this.isTriggerPriorityPopup = event;
  }

  getPolicies(event: any) {
    if (event) {
      this.getPoliciesEventEmitter.next(true);
    }
  }

  handleOptionClick(dataItem: any, type: any) {
    if (type == 'Delete') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.selectedPolicyPriority = dataItem.priorityCode;
      this.onDeleteConfirmOpenClicked();
    }
    if (type.toUpperCase() == 'EDIT') {
      this.isPaymentDone = dataItem.isPaymentDone
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.handleHealthInsuranceOpenClicked('edit');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
        this.insurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }
    if (type == 'priority') {
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.selectedInsurance=dataItem;
      this.onChangePriorityOpenClicked()
    }
    if(type.toUpperCase() == 'COPY'){
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.handleHealthInsuranceOpenClicked('copy');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
      this.insurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }
    this.cdr.detectChanges();
  }

  onDeleteConfirmOpenClicked() {
    this.isOpenedDeleteConfirm = true;
  }
  onDeleteConfirmCloseClicked() {
    this.isOpenedDeleteConfirm = false;
  }
  deleteInsurancePolicy() {
    if(this.selectedPolicyPriority === PriorityCode.Primary){
      this.isTriggerPriorityPopup = true;
    }
    else{
      this.isTriggerPriorityPopup = false;
    }
    this.deleteInsurancePlan.next(this.currentInsurancePolicyId);
  }

  onChangePriorityOpenClicked() {
    this.isOpenedChangePriorityModal = true;
  }
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.filter = stateData?.filter?.filters;
    this.loadInsurancePolicies();

  }
  getCarrierContactInfo(carrierId:string,insurancePlanName:string){
    this.carrierContactInfo='';
    this.insurancePlanName='';
    this.insurancePolicyFacade.getCarrierContactInfo(carrierId).subscribe({
      next: (data) => {
        this.carrierContactInfo=data;
        this.insurancePlanName=insurancePlanName;
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

  handleHealthInsuranceCloseClicked() {
    this.isOpenedHealthInsuranceModal = false;
  }
  priorityAdded(){
    this.loadInsurancePolicies();
  }
  onChangePriorityCloseClicked() {
    this.isOpenedChangePriorityModal = false;
    this.isTriggerPriorityPopup = false;
  }
  addOrEditClicked(addEditButonClicked:any){
    if(addEditButonClicked){
     this.loadInsurancePolicies();
     this.clientFacade.runImportedClaimRules(this.clientId);
    }
  }
  loadInsurancePolicyList(
    skipcountValue: number,
    maxResultCountValue: number,
    sortColumn: any,
    sortType: any,
    filter:any
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pageSize: maxResultCountValue,
      sortColumn: sortColumn,
      sortType: sortType,
      loadHistoricalData:this.showHistoricalFlag,
      filter:filter
    };
    this.loadInsurancePlanEvent.next(gridDataRefinerValue);
  }

  private loadInsurancePolicies(): void {
    this.loadInsurancePolicyList(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filter === undefined?null:this.filter
    );
  }

  private priorityPopupShowSubscription(){
    this.triggerPriorityPopup$.subscribe((value:boolean)=>{
      if (this.insuranceStatus != InsuranceStatusType.dentalInsurance) {
        if(this.selectedEligibilityId === null || 
          this.selectedEligibilityId === undefined){
            this.selectedEligibilityId = this.caseEligibilityId;
          }
        if(value && this.isTriggerPriorityPopup){
          this.isEditInsurancePriorityTitle = false;
          this.insurancePriorityModalButtonText = 'Save';
          this.selectedEligibilityId = this.caseEligibilityId;  
          this.onChangePriorityOpenClicked();
        }
        else
        {
          this.isEditInsurancePriorityTitle = true;
          this.insurancePriorityModalButtonText = 'Update';
        }
      }
    })
  } 
}
