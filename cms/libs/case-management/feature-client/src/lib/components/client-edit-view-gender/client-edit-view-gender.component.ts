import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CompletionChecklist, StatusFlag, WorkflowFacade,GenderCode,ClientFacade, ControlPrefix } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-client-edit-view-gender',
  templateUrl: './client-edit-view-gender.component.html',
  styleUrls: ['./client-edit-view-gender.component.scss'],
})
export class ClientEditViewGenderComponent implements OnInit,OnDestroy {
  @Input() appInfoForm: FormGroup;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  GenderLovs$ = this.lovFacade.genderlov$;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  ControlPrefix = ControlPrefix.gender;
  DescriptionField = 'genderDescription';
  maxLengthFifty =50;
  disableGender:any;
  appInfoSubscription!:Subscription;
  private countOfSelection=0; 
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly workflowFacade : WorkflowFacade,
    private readonly clientfacade: ClientFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ });
  }
  Genders: any = [];
  ngOnInit(): void {
    this.lovFacade.getGenderLovs();
    this.loadGendersLov();
    this.formChangeSubscription();
    this.loadApplicantInfoSubscription();
  }
  ngOnDestroy(): void {
    this.appInfoSubscription.unsubscribe();    
  }
  private loadGendersLov() {
    this.GenderLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;
      data.forEach((element) => {
        this.appInfoForm.addControl(
          ControlPrefix.gender + element.lovCode,
          new FormControl('')
        );
      });
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.appInfoForm.addControl(
        'GenderGroup',
        new FormControl('')
      );
      this.Genders = data;
      this.disableGender =  this.Genders.filter((x:any)=>x.lovCode !== GenderCode.dontKnow && x.lovCode !== GenderCode.dontKnowAnswer && x.lovCode !== GenderCode.dontKnowQustion)
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
    const genderControls = Object.keys(this.appInfoForm.controls).filter(m => m.includes(ControlPrefix.gender));
    genderControls.forEach((gender: any) => {
      this.appInfoForm.controls[gender].removeValidators(Validators.requiredTrue);
      this.appInfoForm.controls[gender].updateValueAndValidity();
    });
  }
  private assignGenderModelToForm(clientGenderList:any){
    if (Array.isArray(clientGenderList) ) {
      clientGenderList.forEach((gender:any) => { 
      this.appInfoForm.controls[ControlPrefix.gender +gender.clientGenderCode]?.setValue(true);
      if(gender.clientGenderCode===GenderCode.notListed && gender.otherDesc!==null){
        this.appInfoForm.controls['GenderDescription']?.setValue(gender.otherDesc);
      }
      this.appInfoForm.controls['GenderGroup']?.setValue(gender.clientGenderCode);
      
    })
  }
  }
  private loadApplicantInfoSubscription(){
    this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{   
      if(applicantInfo !== null){ 
        if(applicantInfo.clientGenderList !== null && applicantInfo.clientGenderList !== undefined
        && applicantInfo.clientGenderList.length>0){
          this.assignGenderModelToForm(applicantInfo.clientGenderList);
          var otherGeder =  applicantInfo.clientGenderList.filter((x:any)=>x.clientGenderCode === GenderCode.dontKnow|| x.clientGenderCode === GenderCode.dontKnowAnswer || x.clientGenderCode === GenderCode.dontKnowQustion)
          if(otherGeder.length>0){
            this.enableDisableGender(true, otherGeder[0].clientGenderCode);
          }
        }        
      }
    });
  }

  enableDisableGender(checked:boolean,lovCode:any){
    this.appInfoForm.controls[this.DescriptionField].removeValidators(
      Validators.required
    );
    this.appInfoForm.controls[
      this.DescriptionField
    ].updateValueAndValidity();
    switch(lovCode){  
      case GenderCode.dontKnow:
      case GenderCode.dontKnowAnswer:
      case GenderCode.dontKnowQustion:{
        if(checked){
          this.disableGender.forEach((gender:any) => { 
            this.appInfoForm.controls[ ControlPrefix.gender + gender.lovCode].setValue(false);
            this.appInfoForm.controls[ ControlPrefix.gender + gender.lovCode].disable();
          });   
          break;
        }
        else{
          if(lovCode === GenderCode.dontKnow){
            if(!this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnowAnswer].value === true && 
              !this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnowQustion].value === true){
              this.disableGender.forEach((gender:any) => { 
                this.appInfoForm.controls[ ControlPrefix.gender + gender.lovCode].enable();
              });  
            }
          }
          if(lovCode ===GenderCode.dontKnowAnswer){
            if(!this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnow].value === true &&
              !this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnowQustion].value === true){
              this.disableGender.forEach((gender:any) => { 
                this.appInfoForm.controls[ ControlPrefix.gender + gender.lovCode].enable();
              });  
            }
          }
          if(lovCode ===GenderCode.dontKnowQustion){
            if(!this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnow].value === true &&
              !this.appInfoForm.controls[ControlPrefix.gender + GenderCode.dontKnowAnswer].value === true){
              this.disableGender.forEach((gender:any) => { 
                this.appInfoForm.controls[ ControlPrefix.gender + gender.lovCode].enable();
              });  
            }
          }
        }
      }

    }
   }
  onCheckChange(event: any, lovCode: string) {
    this.enableDisableGender(event.target.checked,lovCode);
    if (event.target.checked) {
      this.appInfoForm.controls['GenderGroup'].setValue(lovCode);
      if (lovCode === GenderCode.notListed) {
        this.appInfoForm.controls[this.DescriptionField].setValidators(
          Validators.required
        );
      }      
    } else {
      this.appInfoForm.controls['GenderGroup'].setValue('');

      if (lovCode === GenderCode.notListed) {
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
