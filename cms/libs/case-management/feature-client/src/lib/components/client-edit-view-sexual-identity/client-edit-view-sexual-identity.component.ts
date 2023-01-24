import { Component, Input, OnInit,OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompletionChecklist, StatusFlag, WorkflowFacade,SexualIdentityCode,ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-client-edit-view-sexual-identity',
  templateUrl: './client-edit-view-sexual-identity.component.html',
  styleUrls: ['./client-edit-view-sexual-identity.component.scss'],
})
export class ClientEditViewSexualIdentityComponent implements OnInit,OnDestroy {
  @Input() appInfoForm: FormGroup;

  SexulaIdentityLovs$ = this.lovFacade.sexulaIdentitylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ControlPrefix = 'SexulaIdentity';
  DescriptionField = 'SexulaIdentityDescription';
  disableSexualIdentity:any;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  appInfoSubscription!:Subscription;
  private countOfSelection=0; 
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly workflowFacade : WorkflowFacade,
    private readonly clientfacade: ClientFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ SexulaIdentity: [''] });
  }
  SexulaIdentities: any = [];

  ngOnInit(): void {
    this.lovFacade.getSexulaIdentityLovs();
    this.loadSexulaIdentities();
    this.formChangeSubscription();
    this.loadApplicantInfoSubscription();
  }
  ngOnDestroy(): void {
    this.appInfoSubscription.unsubscribe();    
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
      this.disableSexualIdentity =  this.SexulaIdentities.filter((x:any)=>x.lovCode !== SexualIdentityCode.dontKnow && x.lovCode !== SexualIdentityCode.dontWant && x.lovCode !== SexualIdentityCode.dontKnowQustion)
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

  onCheckChange(event: any, lovCode: string) {
    this.enableDisableSexualIdentity(event.target.checked,lovCode);
    if (event.target.checked) {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue(lovCode);
      if (lovCode === SexualIdentityCode.notListed) {
        this.appInfoForm.controls[this.DescriptionField].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          this.DescriptionField
        ].updateValueAndValidity();
      }
      //this.countOfSelection++;
    } else {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue('');

      if (lovCode ===  SexualIdentityCode.notListed) {
        this.appInfoForm.controls[this.DescriptionField].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          this.DescriptionField
        ].updateValueAndValidity();
      }
      //this.countOfSelection = this.countOfSelection > 0 ?  --this.countOfSelection: this.countOfSelection;
    }

    //this.updateWorkflowCount(this.countOfSelection > 0);
  }
  private loadApplicantInfoSubscription(){
    this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{   
      if(applicantInfo !== null){ 
        if(applicantInfo.clientSexualIdentityList !== null && applicantInfo.clientSexualIdentityList !== undefined
        && applicantInfo.clientSexualIdentityList.length>0){
          this.assignSexualIdentityToForm(applicantInfo.clientSexualIdentityList);
          var otherSexualIdentities =  applicantInfo.clientSexualIdentityList.filter((x:any)=>x.clientSexualIdentityCode === SexualIdentityCode.dontKnow|| x.clientSexualIdentityCode === SexualIdentityCode.dontWant || x.clientSexualIdentityCode === SexualIdentityCode.dontKnowQustion)
          if(otherSexualIdentities.length>0){
            this.enableDisableSexualIdentity(true, otherSexualIdentities[0].clientSexualIdentityCode);
          }
          this.updateWorkflowCount(true);
        }        
      }
    });
  }
  private assignSexualIdentityToForm(clientSexualIdentityList:any){
    if (Array.isArray(clientSexualIdentityList) ) {
      clientSexualIdentityList.forEach(identity => { 
        this.appInfoForm.controls[this.ControlPrefix + identity.clientSexualIdentityCode]?.setValue(true);
        if(identity.clientSexualIdentityCode===SexualIdentityCode.notListed && identity.otherDesc!==null){
          this.appInfoForm.controls['SexulaIdentityDescription']?.setValue(identity.otherDesc);
        }
        this.appInfoForm.controls['SexulaIdentityGroup']?.setValue(identity.clientSexualIdentityCode);
        
      })
    }
  }
  enableDisableSexualIdentity(checked:boolean,lovCode:any){
    switch(lovCode){  
      case SexualIdentityCode.dontKnow:
      case SexualIdentityCode.dontWant:
      case SexualIdentityCode.dontKnowQustion:{
        if(checked){
          this.disableSexualIdentity.forEach((sexualIdentity:any) => { 
            this.appInfoForm.controls[ this.ControlPrefix + sexualIdentity.lovCode].setValue(false);
            this.appInfoForm.controls[ this.ControlPrefix + sexualIdentity.lovCode].disable();
          });   
          break;
        }
        else{
          if(lovCode === SexualIdentityCode.dontKnow){
            if(!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true && 
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true){
              this.disableSexualIdentity.forEach((sexualIdentity:any) => { 
                this.appInfoForm.controls[ this.ControlPrefix + sexualIdentity.lovCode].enable();
              });  
            }
          }
          if(lovCode ===SexualIdentityCode.dontWant){
            if(!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true){
              this.disableSexualIdentity.forEach((sexualIdentity:any) => { 
                this.appInfoForm.controls[ this.ControlPrefix + sexualIdentity.lovCode].enable();
              });  
            }
          }
          if(lovCode ===SexualIdentityCode.dontKnowQustion){
            if(!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true){
              this.disableSexualIdentity.forEach((sexualIdentity:any) => { 
                this.appInfoForm.controls[ this.ControlPrefix + sexualIdentity.lovCode].enable();
              });  
            }
          }
        }
      }

    }
   }
}
