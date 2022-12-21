/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
/** Facades **/
import { HealthInsuranceFacade ,HealthInsurancePolicyFacade} from '@cms/case-management/domain';

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

  /** Input properties **/
  @Input() healthInsuranceForm: FormGroup;

  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Insurance",
      icon: "edit",
      click: (dataItem:any): void => {
        
        if(dataItem.clientInsurancePolicyId===undefined) return;
        
        this.handleHealthInsuranceOpenClicked('edit');
        this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(dataItem.clientInsurancePolicyId);
        this.healthInsurancePolicyFacade.getHealthInsurancePolicyById(dataItem.clientInsurancePolicyId);
        // this.handleInsuranceType(dataItem.InsuranceType)
      },
    },
    
    {
      buttonType:"btn-h-primary",
      text: "Change Priority",
      icon: "format_line_spacing",
      click: (): void => {
       this.onChangePriorityOpenClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete Insurance",
      icon: "delete",
      click: (): void => {
       this.onDeleteConfirmOpenClicked()
      },
    },
   
    
 
  ];

  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private readonly healthInsurancePolicyFacade: HealthInsurancePolicyFacade,
    private formBuilder: FormBuilder) {
      this.healthInsuranceForm = this.formBuilder.group({});
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthInsurancePlans();
  }


  /** Internal event methods **/
  onChangePriorityCloseClicked() {
    this.isOpenedChangePriorityModal = false;
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
  handleInsuranceType(insuranceType: string) {
    this.insuranceType = insuranceType;
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
    }
  }

  loadHealthInsurancePlans(){
    this.healthFacade.medicalHealthPlans$.subscribe((medicalHealthPolicy:any)=>{
    })
  }
}
