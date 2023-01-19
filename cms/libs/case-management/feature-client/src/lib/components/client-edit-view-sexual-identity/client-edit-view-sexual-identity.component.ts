import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompletionChecklist, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-sexual-identity',
  templateUrl: './client-edit-view-sexual-identity.component.html',
  styleUrls: ['./client-edit-view-sexual-identity.component.scss'],
})
export class ClientEditViewSexualIdentityComponent implements OnInit {
  @Input() appInfoForm: FormGroup;

  SexulaIdentityLovs$ = this.lovFacade.sexulaIdentitylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ControlPrefix = 'SexulaIdentity';
  DescriptionField = 'SexulaIdentityDescription';
  private countOfSelection=0; 
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly workflowFacade : WorkflowFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ SexulaIdentity: [''] });
  }
  SexulaIdentities: any = [];

  ngOnInit(): void {
    this.lovFacade.getSexulaIdentityLovs();
    this.loadSexulaIdentities();
    this.formChangeSubscription();
  }
  private loadSexulaIdentities() {
    this.SexulaIdentityLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;
      data.forEach((element) => {
        this.appInfoForm.addControl(
          this.ControlPrefix + element.lovCode,
          new FormControl('')
        );
      });
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.appInfoForm.addControl(
        'SexulaIdentityGroup',
        new FormControl('')
      );
      this.SexulaIdentities = data;
    });
  }

  private formChangeSubscription(){
    this.appInfoForm.controls['SexulaIdentityGroup'].valueChanges.subscribe(value=>{
      if(value && this.countOfSelection >=0){
        this.updateWorkflowCount(true);
        this.countOfSelection++;
      }
      else{
        this.countOfSelection = this.countOfSelection > 0 ? --this.countOfSelection : this.countOfSelection;
        if(this.countOfSelection <= 0){
          this.updateWorkflowCount(false);
        }
      }
    });
  }
  
  private updateWorkflowCount(isCompleted:boolean){
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'sexualIdentity',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];
  
    this.workflowFacade.updateChecklist(workFlowdata);
  }
  setControlValidations() {
    const sexulaIdentity = Object.keys(this.appInfoForm.controls).filter(m => m.includes('SexulaIdentity'));
    sexulaIdentity.forEach((gender: any) => {
      this.appInfoForm.controls[gender].removeValidators(Validators.requiredTrue);
      this.appInfoForm.controls[gender].updateValueAndValidity();
    });
  }
  onCheckChange(event: any, lovCode: string) {
    if (event.target.checked) {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue(lovCode);
    } else {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue('');

      if (lovCode === 'NOT_LISTED') {
        this.appInfoForm.controls[this.DescriptionField].setValue(null); 
        this.appInfoForm.controls[this.DescriptionField].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          this.DescriptionField
        ].updateValueAndValidity();
      }
    }
    this.setControlValidations();
  }
}
