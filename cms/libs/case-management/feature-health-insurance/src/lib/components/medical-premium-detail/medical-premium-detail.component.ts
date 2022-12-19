/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { InsurancePlanFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit {
 currentDate = new Date();
 public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;
  @Input() healthInsuranceForm: FormGroup;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();

  /** Public properties **/
  ddlMedicalHealthInsurancePlans$ =
  this.healthFacade.ddlMedicalHealthInsurancePlans$;

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;

  ddlMedicalHealthPlanMetalLevel$ =
    this.healthFacade.ddlMedicalHealthPlanMetalLevel$;
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.healthFacade.ddlMedicalHealthPalnPremiumFrequecy$;
  ddlInsuranceType!: string;
  isEditViewPopup!: boolean;
  isDeleteEnabled!: boolean;
  isSubmitted: boolean=false;
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  isOpenDdl = false;
  insurancePlans: Array<any> = [];

  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade,
     private formBuilder: FormBuilder,
     private lovFacade: LovFacade,
     private insurancePlanFacade:InsurancePlanFacade) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.validateFormMode();
    this.loadLovs();
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
  }

  /** Private methods **/
  private loadLovs(){
    this.lovFacade.getInsuranceTypeLovs()
  }
  private validateFormMode(){
    if(this.dialogTitle ==='Add'){
      this.resetForm();
      this.resetValidators();
    }

  }
  resetForm(){
    this.healthInsuranceForm.reset();
    this.healthInsuranceForm.updateValueAndValidity();
  }
  private loadDdlMedicalHealthInsurancePlans() {
    this.healthFacade.loadDdlMedicalHealthInsurancePlans();
  }

  private loadDdlMedicalHealthPlanMetalLevel() {
    this.healthFacade.loadDdlMedicalHealthPlanMetalLevel();
  }

  private loadDdlMedicalHealthPalnPremiumFrequecy() {
    this.healthFacade.loadDdlMedicalHealthPalnPremiumFrequecy();
  }

  private viewSelection() {
    this.isToggleNewPerson = false;
    switch (this.dialogTitle) {
      case 'View':
        this.isEditViewPopup = true;
        this.conditionsInsideView();
        this.isViewContentEditable = true;
        break;
      case 'Add':
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        break;
      case 'Edit':
        this.conditionsInsideView();
        this.isDeleteEnabled = true;
        this.isViewContentEditable = false;
        break;
      default:
        break;
    }
  }

  private conditionsInsideView() {
    this.ddlInsuranceType = this.insuranceType;
    this.isOpenDdl = true;
  }
 
  private validateForm(){  
      this.healthInsuranceForm.updateValueAndValidity();  
      if(this.ddlInsuranceType ==='COBRA' ||this.ddlInsuranceType ==='QUALIFIED_HEALTH_PLAN')  { 
        this.healthInsuranceForm.controls["insuranceStartDate"].setValidators([Validators.required]); 
        this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();
    
        this.healthInsuranceForm.controls["insuranceEndDate"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();    
      
        this.healthInsuranceForm.controls["insuranceIdNumber"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();     

        this.healthInsuranceForm.controls["insuranceCarrierName"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
      
        this.healthInsuranceForm.controls["insurancePlanName"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insurancePlanName"].updateValueAndValidity();
      }
      
  }
  private resetValidators(){
    this.healthInsuranceForm.controls["insuranceStartDate"].clearValidators(); 
    this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();

    this.healthInsuranceForm.controls["insuranceEndDate"].clearValidators();
    this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();    
  
    this.healthInsuranceForm.controls["insuranceIdNumber"].clearValidators();
    this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();     

    this.healthInsuranceForm.controls["insuranceCarrierName"].clearValidators();
    this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
  
    this.healthInsuranceForm.controls["insurancePlanName"].clearValidators();
    this.healthInsuranceForm.controls["insurancePlanName"].updateValueAndValidity();
  }
  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.ddlInsuranceType = this.healthInsuranceForm.controls['insuranceType'].value ;
    this.isOpenDdl = true;
  }

  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }
  onRedirectModalClicked() {
    this.isViewContentEditable = false;
    this.isEditViewPopup = false;
    this.isDeleteEnabled = true;
    this.editRedirect.emit('edit');
  }
  onToggleNewPersonClicked() {
    this.isToggleNewPerson = !this.isToggleNewPerson;
  }
  insuranceCarrierNameChange(value:string){
    this.insurancePlanFacade.loadInsurancePlanByProviderId(value).subscribe((data:any) => {
      this.insurancePlans=[];
      if (!Array.isArray(data)) return;
      this.insurancePlans=data;
    });
  }
  save(){
    this.isSubmitted=true;
    this.validateForm();
  }

}
