/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { CompletionChecklist, HealthInsurancePolicyFacade, PriorityCode, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';
import { FilterService } from '@progress/kendo-angular-grid';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-list',
  templateUrl: './medical-premium-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MedicalPremiumListComponent implements OnInit {
  /** Public properties **/
  isEditInsurancePriorityTitle = false;
  insurancePriorityModalButtonText = 'Save';
  medicalHealthPlans$ = this.healthInsurancePolicyFacade.medicalHealthPlans$;
  isTriggerPriorityPopup = false;
  isOpenedHealthInsuranceModal = false;
  isOpenedChangePriorityModal = false;
  isOpenedDeleteConfirm = false;
  isEdit!: boolean;
  isOpenedRemoveConfirm = false;
  dialogTitle!: string;
  insuranceType!: string;
  columnOptionDisabled = false;
  public pageSizes = this.healthInsurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.healthInsurancePolicyFacade.skipCount;
  public state!: State;
  sort!: any;
  currentInsurancePolicyId: any;
  selectedInsurance: any;
  medicalHealthPlansCount: any;
  gridList = [];
  carrierContactInfo: any;
  insurancePlanName: string = '';
  selectedEligibilityId:any;
  selectedPolicyPriority:any=null;
  isDeletePolicy:any= false;
  filter!: any;
  sortValue:any ='healthInsuranceTypeDesc';
  sortType:any='asc';
  healthInsuranceTypeDesc:any;
  priorityDesc:any;
  premiumFrequencyDesc:any;
  careassistPayingPremiumFlagValue:any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  showInsuranceRequired = this.healthInsurancePolicyFacade.showInsuranceRequired$;
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  yesOrNoLovs: any = [];

  /** Input properties **/
  @Input() healthInsuranceForm: FormGroup;
  @Input() closeDeleteModal: boolean = false;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() triggerPriorityPopup$!: Observable<boolean>;
  @Input() isCerForm: boolean = false;
  @Input() insuranceTypeList$: any;
  @Input() premiumFrequencyList$:any;
  @Input() priorityCodeType$:any;

  @Output() loadInsurancePlanEvent = new EventEmitter<any>();
  @Output() deleteInsurancePlan = new EventEmitter<any>();
  @Output() removeInsurancePlan = new EventEmitter<any>();
  @Output() getPoliciesEventEmitter = new EventEmitter<any>();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Insurance",
      icon: "edit",
      type: "Edit",
      click: (): void => {
        this.handleHealthInsuranceOpenClicked('edit');
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Change Priority",
      icon: "format_line_spacing",
      type: "priority",
      click: (): void => { },
    },   
    {
      buttonType: "btn-h-danger",
      text: "Delete Insurance",
      icon: "delete",
      type: "Delete",
      btnName: "delete",
      click: (): void => {
        this.onDeleteConfirmOpenClicked()
      },
    }

  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly healthInsurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly route: ActivatedRoute,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.priorityPopupShowSubscription();
    this.loadYesOrNoLovsInit();
    this.lovFacade.getYesOrNoLovs();
    if (this.isCerForm) {
      this.actions.push({
        buttonType: "btn-h-primary",
        text: "Copy Insurance",
        icon: "content_copy",
        type: "Copy",
        btnName: "copy",
        click: (): void => {
          this.handleHealthInsuranceOpenClicked('copy');
        },
      });
    }   
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    if (this.closeDeleteModal) {
      this.onDeleteConfirmCloseClicked();
      this.handleHealthInsuranceCloseClicked();
      this.onRemoveCloseClicked();
    }
    this.loadHealthInsurancePlans();
  }
  /** Internal event methods **/

  private priorityPopupShowSubscription() {
    this.triggerPriorityPopup$.subscribe((value: boolean) => {
      if (value && this.isTriggerPriorityPopup) {
        this.isEditInsurancePriorityTitle = false;
        this.insurancePriorityModalButtonText = 'Save';
        this.selectedEligibilityId = this.caseEligibilityId;
        this.onChangePriorityOpenClicked();
      }
      else {
        this.isEditInsurancePriorityTitle = true;
        this.insurancePriorityModalButtonText = 'Update';
      }
    })
  }

  onChangePriorityCloseClicked() {
    this.isOpenedChangePriorityModal = false;
    this.isTriggerPriorityPopup = false;
  }
  priorityAdded() {
    this.loadInsurancePolicies();
  }
  onChangePriorityOpenClicked() {
    this.isOpenedChangePriorityModal = true;
  }

  onDeleteConfirmCloseClicked() {
    this.isOpenedDeleteConfirm = false;
  }

  dropdownFilterChange(field: string, value: any, filterService: FilterService): void {
  
    let valueSet = value.lovDesc;
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
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value: valueSet
      }],
      logic: "or"
    });
  }

  private loadYesOrNoLovsInit() {
    this.yesOrNoLov$
      .subscribe({
        next: (data: any) => {
          this.yesOrNoLovs = data;
        }
      });
  }

  onDeleteConfirmOpenClicked() {
    if(this.selectedPolicyPriority === PriorityCode.Primary){
      this.isTriggerPriorityPopup = true;
    }
    else{
      this.isTriggerPriorityPopup = false;
    }
    if (this.isCerForm) {
      this.isOpenedRemoveConfirm = true;
    }
    else {
      this.isOpenedDeleteConfirm = true;
    }
  }

  onRemoveConfirmCloseClicked(value: any) {
    if (value?.confirm === true) {
      this.isOpenedRemoveConfirm = false;
      if (value?.endDate) {
        value.currentInsurancePolicyId = this.currentInsurancePolicyId
        this.removeInsurancePlan.emit(value)
      }
    }
    else if (value?.confirm === false) {
      this.isOpenedRemoveConfirm = false;
    }
  }

  onRemoveCloseClicked() {
    this.isOpenedRemoveConfirm = false;
  }

  onRemoveConfirmOpenClicked() {
    this.isOpenedRemoveConfirm = true;
  }

  /** External event methods **/
  handleInsuranceType(dataItem: any) {
    this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
    this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
    this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
  }

  handleHealthInsuranceCloseClicked() {
    this.isOpenedHealthInsuranceModal = false;
  }

  handleHealthInsuranceOpenClicked(value: string) {
    this.isOpenedHealthInsuranceModal = true;
    switch (value) {
      case 'view':
        this.dialogTitle = 'View';
        this.isEdit = false;
        break;
      case 'edit':
        this.dialogTitle = 'Edit';
        this.isEdit = true;
        break;
      case 'add':
        this.dialogTitle = 'Add';
        this.isEdit = false;
        break;
      case 'review':
        this.dialogTitle = 'Review';
        this.isEdit = true;
        break;
      case 'copy':
        this.dialogTitle = 'Copy';
        this.isEdit = true;
        break;
    }
  }

  loadHealthInsurancePlans() {
    this.healthInsurancePolicyFacade.medicalHealthPlans$.subscribe((medicalHealthPolicy: any) => {
      this.medicalHealthPlansCount = medicalHealthPolicy?.data?.length;
      if (medicalHealthPolicy?.data?.length > 0)
        this.gridList = medicalHealthPolicy.data.map((x: any) => Object.assign({}, x));
      if (medicalHealthPolicy?.length > 0) {
        const item: CompletionChecklist = {
          dataPointName: 'currentInsuranceFlag',
          status: StatusFlag.Yes
        };
        this.workflowFacade.updateChecklist([item]);
      }
    })
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort = { field: 'creationTime', dir: 'asc' };
    this.loadInsurancePolicies();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.filter = stateData?.filter?.filters;
    this.loadInsurancePolicies();
  }
  // Loading the grid data based on pagination
  private loadInsurancePolicies(): void {
    this.loadInsurancePolicyList(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filter === undefined?null:this.filter
    );
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
      pagesize: maxResultCountValue,
      sortColumn: sortColumn,
      sortType: sortType,
      filter:filter
    };
    this.loadInsurancePlanEvent.next(gridDataRefinerValue);
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

  handleOptionClick(dataItem: any, type: any) {
    if (type == 'Delete') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.selectedPolicyPriority = dataItem.priorityCode;
      this.isDeletePolicy = true;
      this.onDeleteConfirmOpenClicked();
    }
    else if (type == 'Edit') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.isDeletePolicy = false;
      this.handleHealthInsuranceOpenClicked('edit');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
      this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }
    else if (type == 'priority') {
      this.isDeletePolicy = false;
      this.selectedInsurance = dataItem;
      this.selectedEligibilityId = dataItem.clientCaseEligibilityId;
      this.onChangePriorityOpenClicked()
    }
    else if(type == 'Copy'){
      this.isDeletePolicy = false;
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.handleHealthInsuranceOpenClicked('copy');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
      this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }

    this.cdr.detectChanges();
  }
  deleteButonClicked(deleteButonClicked: any) {
    if (deleteButonClicked) {
      this.onDeleteConfirmOpenClicked();
    }
  }
  addOrEditClicked(addEditButonClicked: any) {
    if (addEditButonClicked) {
      this.loadInsurancePolicies();
    }
  }
  isAddPriority(event: any) {
    this.isTriggerPriorityPopup = event;
  }
  getCarrierContactInfo(carrierId: string, insurancePlanName: string) {
    this.carrierContactInfo = '';
    this.insurancePlanName = '';
    this.healthInsurancePolicyFacade.getCarrierContactInfo(carrierId).subscribe({
      next: (data) => {
        this.carrierContactInfo = data;
        this.insurancePlanName = insurancePlanName;
      },
      error: (err) => {
        if (err) {
          this.healthInsurancePolicyFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        }
      },
    });
  }

  getPolicies(event: any) {
    if (event) {
      this.getPoliciesEventEmitter.next(true);
    }
  }
}
