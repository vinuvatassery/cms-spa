/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy,Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
/** Facades **/
import { HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-insurance-status-list',
  templateUrl: './medical-insurance-status-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalInsuranceStatusListComponent implements OnInit {
  /** Public properties **/
  healthInsuranceStatus$ = this.insurancePolicyFacade.healthInsuranceStatus$;
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isOpenedHealthInsuranceModal:boolean= false;
  insuranceType!: string;
  dialogTitle!: string;
  @Input() healthInsuranceForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  public gridOptionData = [
    {
      buttonType:"btn-h-primary",
      text: "Copy Status",
      icon: "content_copy",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit Status",
      icon: "edit",
      click: (): void => {
      },
    },
    
   
    
 
  ];

  /** Constructor **/
  constructor( private insurancePolicyFacade: HealthInsurancePolicyFacade, private readonly formBuilder: FormBuilder) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadHealthInsuranceStatus();
  }
  handleHealthInsuranceOpenClicked(value: string) {
    this.isOpenedHealthInsuranceModal = true;
    switch (value) {
      // case 'view':
      //   this.dialogTitle = 'View';
      //   this.isEdit = false;
      //   break;
      // case 'edit':
      //   this.dialogTitle = 'Edit';
      //   this.isEdit = true;
      //   break;
      case 'add':
        this.dialogTitle = 'Add';
        //this.isEdit = false;
        break;
    }
  }
  handleHealthInsuranceCloseClicked() {
    this.isOpenedHealthInsuranceModal = false;
  }

  /** Private methods **/
  private loadHealthInsuranceStatus() {
    this.insurancePolicyFacade.loadHealthInsuranceStatus();
  }
  
}
