/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input,Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import { HealthInsurancePolicyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-medical-insurance-status-list',
  templateUrl: './medical-insurance-status-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MedicalInsuranceStatusListComponent implements OnInit {
  /** Public properties **/
  healthInsuranceStatus$ = this.insurancePolicyFacade.healthInsuranceStatus$;
  medicalHealthPlans$ = this.insurancePolicyFacade.medicalHealthPlans$;
  isCopyInsuranceConfirm = false;  

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
  @Output() copyInsurancePlan = new EventEmitter<any>();
  @Output() loadHistoricalPlan = new EventEmitter<boolean>();
  showHistoricalFlag:boolean = false;
  carrierContactInfo:any;
  insurancePlanName:any;
  insuranceStatusType:any;
  isEdit!: boolean;
  currentInsurancePolicyId:any;
  isTriggerPriorityPopup = false;
  isOpenedChangePriorityModal:boolean= false;
  isEditInsurancePriorityTitle = false;
  selectedInsurance: any;
  public state!: State;
  sort!:any;
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  isOpenedDeleteConfirm:boolean = false;
  public pageSizes = this.insurancePolicyFacade.gridPageSizes;
  public gridSkipCount = this.insurancePolicyFacade.skipCount;
  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Copy Record",
      icon: "content_copy",
      type:"Copy",
      click: (): void => {
        //this.onCopyInsuranceConfirmOpenClicked();
      },
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
      buttonType: "btn-h-primary",
      text: "Change Priority",
      icon: "format_line_spacing",
      type: "priority",
      click: (): void => {},
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Insurance",
      icon: "delete",
      type: "Delete",
      click: (): void => {
        //this.onDeleteConfirmOpenClicked()
      },
    }
    
  ];

  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade,
     private readonly formBuilder: FormBuilder,private readonly cdr: ChangeDetectorRef, private caseFacade: CaseFacade) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    //this.loadHealthInsuranceStatus();
    this.priorityPopupShowSubscription();  
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
    //this.loadHealthInsurancePlans();
  }
  // loadHealthInsurancePlans() {
  //   this.insurancePolicyFacade.medicalHealthPlans$.subscribe((medicalHealthPolicy: any) => {
  //     this.medicalHealthPlansCount = medicalHealthPolicy?.data?.length;
  //     if(medicalHealthPolicy?.data?.length > 0)
  //     this.gridList=medicalHealthPolicy.data.map((x:any) => Object.assign({}, x));
  //     if(medicalHealthPolicy?.length > 0){
  //       const item: CompletionChecklist = {
  //         dataPointName: 'currentInsuranceFlag',
  //         status: StatusFlag.Yes
  //       };
  //       this.workflowFacade.updateChecklist([item]);
  //     }
  //   })
  // }
  pageselectionchange(data: any) {
    debugger;
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort ={ field : 'creationTime' ,  dir: 'asc' };
    this.loadInsurancePolicies();
  }

  handleHealthInsuranceOpenClicked(value: string) {
    this.isOpenedHealthInsuranceModal = true;
    switch (value) {
      // case 'view':
      //   this.dialogTitle = 'View';
      //   this.isEdit = false;
      //   break;
      case 'edit':
        this.dialogTitle = 'Edit';
        this.isEdit = true;
        break;
      case 'add':
        this.dialogTitle = 'Add';
        this.isEdit = false;
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
    //this.loadInsurancePolicies();
  }
  isAddPriority(event:any)
  {
    this.isTriggerPriorityPopup = event;
  }
  handleOptionClick(dataItem: any, type: any) {
    if (type == 'Delete') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.onDeleteConfirmOpenClicked();
    }
    if (type.toUpperCase() == 'EDIT') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.handleHealthInsuranceOpenClicked('edit');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
        this.insurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }
    if (type == 'priority') {
      this.selectedInsurance=dataItem;
      this.onChangePriorityOpenClicked()
    }
    if(type.toUpperCase() == 'COPY'){
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.copyInsurancePlan.next(this.currentInsurancePolicyId);
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
    this.isTriggerPriorityPopup = false;
    this.deleteInsurancePlan.next(this.currentInsurancePolicyId);
  }

  onChangePriorityOpenClicked() {
    this.isOpenedChangePriorityModal = true;
  }
  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.sort ={ field : stateData?.sort[0]?.field ?? 'creationTime' ,  dir: stateData?.sort[0]?.dir  ?? 'asc'  };
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
    }
  }
  loadInsurancePolicyList(
    skipcountValue: number,
    maxResultCountValue: number,
    sortColumn: any,
    sortType: any
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortColumn,
      sortType: sortType
    };
    this.loadInsurancePlanEvent.next(gridDataRefinerValue);
  }

  private loadInsurancePolicies(): void {
    this.loadInsurancePolicyList(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sort?.field ?? 'creationTime',
      this.sort?.dir ?? 'asc'
    );
  }

  private priorityPopupShowSubscription(){
    this.triggerPriorityPopup$.subscribe((value:boolean)=>{
      if(value && this.isTriggerPriorityPopup){
        this.isEditInsurancePriorityTitle = false;
        this.insurancePriorityModalButtonText = 'Save';
        this.onChangePriorityOpenClicked();
      }
      else
      {
        this.isEditInsurancePriorityTitle = true;
        this.insurancePriorityModalButtonText = 'Update';
      }
    })
  }


  /** Private methods **/

  // onCopyInsuranceConfirmCloseClicked(){
  //   this.isCopyInsuranceConfirm = false;
  // }
  // onCopyInsuranceConfirmOpenClicked(){
  //   this.isCopyInsuranceConfirm = true;
  // }
}
