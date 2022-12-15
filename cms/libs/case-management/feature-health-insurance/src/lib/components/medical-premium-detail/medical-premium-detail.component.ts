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
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  isOpenDdl = false;

  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade,
     private formBuilder: FormBuilder,
     private lovFacade: LovFacade) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
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
      if(this.healthInsuranceForm.controls["insuranceStartDate"].value === ''){
        this.healthInsuranceForm.controls["insuranceStartDate"].setValidators([Validators.required]); 
        this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();
      }
      else{
        this.healthInsuranceForm.controls["insuranceStartDate"].removeValidators([Validators.required]); 
        this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();
      }
      if(this.healthInsuranceForm.controls["insuranceEndDate"].value === ''){
        this.healthInsuranceForm.controls["insuranceEndDate"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();
      }
      else{
        this.healthInsuranceForm.controls["insuranceEndDate"].removeValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();
      }
      if(this.healthInsuranceForm.controls["insuranceIdNumber"].value === ''){
        this.healthInsuranceForm.controls["insuranceIdNumber"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();
      }
      else{
        this.healthInsuranceForm.controls["insuranceIdNumber"].removeValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();
      }
      if(this.healthInsuranceForm.controls["insuranceCarrierName"].value === ''){
        this.healthInsuranceForm.controls["insuranceCarrierName"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
      }
      else{
        this.healthInsuranceForm.controls["insuranceCarrierName"].removeValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
      }
      
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
  save(){
    debugger;
    this.validateForm();
  }

}
