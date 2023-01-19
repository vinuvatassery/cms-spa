/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { CompletionChecklist, HealthInsuranceFacade ,HealthInsurancePolicyFacade,StatusFlag,WorkflowFacade} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-medical-premium-list',
  templateUrl: './medical-premium-list.component.html',
  styleUrls: ['./medical-premium-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MedicalPremiumListComponent implements OnInit {
  /** Public properties **/
  medicalHealthPlans$ = this.healthFacade.medicalHealthPlans$;
  isOpenedHealthInsuranceModal = false;
  isOpenedChangePriorityModal = false;
  isOpenedDeleteConfirm = false;
  isEdit!: boolean;
  dialogTitle!: string;
  insuranceType!: string;
  public pageSizes = this.healthFacade.gridPageSizes;
  public gridSkipCount = this.healthFacade.skipCount;
  public state!: State;
  currentInsurancePolicyId: any;
  selectedInsurance: any;
  gridList=[];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() healthInsuranceForm: FormGroup;
  @Input() closeDeleteModal: boolean = false;

  @Output() loadInsurancePlanEvent = new EventEmitter<any>();
  @Output() deleteInsurancePlan = new EventEmitter<any>();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Insurance",
      icon: "edit",
      type: "Edit",
      click: (): void => {
        this.handleHealthInsuranceOpenClicked('edit');
        // this.handleInsuranceType(dataItem.InsuranceType)
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
        this.onDeleteConfirmOpenClicked()
      },
    },



  ];

  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly healthInsurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
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
    this.loadHealthInsurancePlans();
  }
  /** Internal event methods **/
  onChangePriorityCloseClicked() {
    this.isOpenedChangePriorityModal = false;
    this.loadInsurancePolicies();
  }

  onChangePriorityOpenClicked() {
    this.isOpenedChangePriorityModal = true;
  }

  onDeleteConfirmCloseClicked() {
    this.isOpenedDeleteConfirm = false;
  }

  onDeleteConfirmOpenClicked() {
    this.isOpenedDeleteConfirm = true;
  }

  /** External event methods **/
  handleInsuranceType(dataItem: any) {
    //this.insuranceType = insuranceType;
    this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
    this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
    this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
  }

  handleHealthInsuranceCloseClicked() {
    this.isOpenedHealthInsuranceModal = false;
    this.loadInsurancePolicies();
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
    }
  }

  loadHealthInsurancePlans() {
    this.healthFacade.medicalHealthPlans$.subscribe((medicalHealthPolicy: any) => {
      if(medicalHealthPolicy?.data?.length > 0)
      this.gridList=medicalHealthPolicy.data.map((x:any) => Object.assign({}, x));
      if(medicalHealthPolicy?.length > 0){
        const item: CompletionChecklist = {
          dataPointName: 'currentInsuranceFlag',
          status: StatusFlag.Yes
        };
        this.workflowFacade.updateChecklist([item]);
      }
    })
  }

  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInsurancePolicies();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.loadInsurancePolicies();
  }
  // Loading the grid data based on pagination
  private loadInsurancePolicies(): void {
    this.loadInsurancePolicyList(
      this.state.skip ?? 0,
      this.state.take ?? 0
    );
  }

  loadInsurancePolicyList(
    skipcountValue: number,
    maxResultCountValue: number
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue
    };
    this.loadInsurancePlanEvent.next(gridDataRefinerValue);
  }

  deleteInsurancePolicy() {
    this.deleteInsurancePlan.next(this.currentInsurancePolicyId);
  }

  handleOptionClick(dataItem: any, type: any) {
    if (type == 'Delete') {
      this.currentInsurancePolicyId = dataItem.clientInsurancePolicyId;
      this.onDeleteConfirmOpenClicked();
    }
    if (type == 'Edit') {
      this.handleHealthInsuranceOpenClicked('edit');
      this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
        this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
    }
    if (type == 'priority') {
      this.selectedInsurance=dataItem;
      this.onChangePriorityOpenClicked()
    }
    this.cdr.detectChanges();
  }
  deleteButonClicked(deleteButonClicked:any){
    if(deleteButonClicked){
      this.onDeleteConfirmOpenClicked();
    }
  }

}
