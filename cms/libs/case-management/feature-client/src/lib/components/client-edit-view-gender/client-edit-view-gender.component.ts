import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-gender',
  templateUrl: './client-edit-view-gender.component.html',
  styleUrls: ['./client-edit-view-gender.component.scss'],
})
export class ClientEditViewGenderComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  GenderLovs$ = this.lovFacade.genderlov$;
  ControlPrefix = 'gender-';
  DescriptionField = 'genderDescription';
  maxLengthFifty =50;
  private countOfSelection=0; 
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly workflowFacade : WorkflowFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ });
  }
  Genders: any = [];
  ngOnInit(): void {
    this.lovFacade.getGenderLovs();
    this.loadGendersLov();
    this.formChangeSubscription();
  }
  private loadGendersLov() {
    this.GenderLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;
      data.forEach((element) => {
        this.appInfoForm.addControl(
          this.ControlPrefix + element.lovCode,
          new FormControl('')
        );
      });
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.appInfoForm.addControl(
        'GenderGroup',
        new FormControl('')
      );
      this.Genders = data;
    });
  }

  private formChangeSubscription(){
    this.appInfoForm.controls['GenderGroup'].valueChanges.subscribe(value=>{
      if(value && this.countOfSelection >= 0){
        this.updateWorkflowCount(true);
        this.countOfSelection++;
      }else{
        this.countOfSelection = this.countOfSelection > 0 ? --this.countOfSelection : this.countOfSelection;
        if(this.countOfSelection <= 0){
          this.updateWorkflowCount(false);
        }
      }
    });
  }

  private updateWorkflowCount(isCompleted:boolean){
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'gender',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];
  
    this.workflowFacade.updateChecklist(workFlowdata);
  }

  setControlValidations() {
    const genderControls = Object.keys(this.appInfoForm.controls).filter(m => m.includes('gender-'));
    genderControls.forEach((gender: any) => {
      this.appInfoForm.controls[gender].removeValidators(Validators.requiredTrue);
      this.appInfoForm.controls[gender].updateValueAndValidity();
    });
  }

  onCheckChange(event: any, lovCode: string) {
    if (event.target.checked) {
      this.appInfoForm.controls['GenderGroup'].setValue('someValue');
      this.appInfoForm.controls['GenderGroup'].updateValueAndValidity();
      if (lovCode === 'NOT_LISTED') {
          this.appInfoForm.controls[this.DescriptionField].setValidators(Validators.required); 
      }      
    } else {    if (lovCode === 'NOT_LISTED') {
      this.appInfoForm.controls[this.DescriptionField].setValue(null); 
      this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required); 
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity(); 
      }     
    } 
    this.setControlValidations();  
  }
}
