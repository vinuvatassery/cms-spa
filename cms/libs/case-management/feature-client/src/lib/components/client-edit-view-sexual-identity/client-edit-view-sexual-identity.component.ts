import { Component, Input, OnInit, OnDestroy,ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompletionChecklist, WorkflowFacade, SexualIdentityCode, ClientFacade, ControlPrefix } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-client-edit-view-sexual-identity',
  templateUrl: './client-edit-view-sexual-identity.component.html',
})
export class ClientEditViewSexualIdentityComponent implements OnInit, OnDestroy {
  @Input() appInfoForm: FormGroup;
  @Input() textboxDisable!:boolean;
  SexulaIdentityLovs$ = this.lovFacade.sexulaIdentitylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ControlPrefix = ControlPrefix.sexualIdentity;
  DescriptionField = 'SexualIdentityDescription';
  disableSexualIdentity: any;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  appInfoSubscription!: Subscription;
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private readonly workflowFacade: WorkflowFacade,
    private readonly clientfacade: ClientFacade,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.appInfoForm = this.formBuilder.group({ SexulaIdentity: [''] });
  }
  SexulaIdentities: any = [];

  ngOnInit(): void {
    this.loadSexulaIdentities();
    this.loadApplicantInfoSubscription();
    if(this.textboxDisable==undefined)
    {
      this.appInfoForm.get(this.DescriptionField)?.disable();
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
    }

  }
  ngOnDestroy(): void {
    this.appInfoSubscription.unsubscribe();
  }
  setControlValidations() {
    let isFieldCompleted = false;
    const sexulaIdentity = Object.keys(this.appInfoForm.controls).filter(m => m.includes(this.ControlPrefix));
    sexulaIdentity.forEach((gender: any) => {
      this.appInfoForm.controls[gender].removeValidators(Validators.requiredTrue);
      this.appInfoForm.controls[gender].updateValueAndValidity();

      const value = this.appInfoForm.controls[gender]?.value;
      if(value === true){
        isFieldCompleted = (isFieldCompleted || value === true)
                          && (
                                (
                                  gender === `${ControlPrefix.sexualIdentity}${SexualIdentityCode.notListed}`
                                  && this.appInfoForm.controls[this.DescriptionField]?.value
                                )
                                || gender !== `${ControlPrefix.sexualIdentity}${SexualIdentityCode.notListed}`
                             );
      }
    });

    this.updateWorkflowCount(isFieldCompleted);
  }
  descriptionChange(){
    this.updateWorkflowCount(this.appInfoForm.controls[this.DescriptionField]?.value ? true : false);
  }
  onCheckChange(event: any, lovCode: string) {
    this.appInfoForm.controls['SexualIdentityGroup'].removeValidators(Validators.required);
    this.appInfoForm.controls['SexualIdentityGroup'].updateValueAndValidity();
    this.enableDisableSexualIdentity(event.target.checked, lovCode);
    this.setControlValidations();
  }
  enableDisableSexualIdentity(checked: boolean, lovCode: any) {
    switch (lovCode) {
      case SexualIdentityCode.notListed:
        this.textboxDisable = !checked;
        break;
      case SexualIdentityCode.dontKnow:
      case SexualIdentityCode.dontWant:
      case SexualIdentityCode.dontKnowQustion: {
        if (checked) {
          this.disableSexualIdentity.forEach((sexualIdentity: any) => {
            this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].setValue(false);
            this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].disable();
            this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required);
            this.textboxDisable = true; 
          });
          break;
        }
        else {
          if (lovCode === SexualIdentityCode.dontKnow) {
            this.onDoNotKnowSelected();
          }
          if (lovCode === SexualIdentityCode.dontWant) {
            this.onDoNotAnswerSelected();
          }
          if (lovCode === SexualIdentityCode.dontKnowQustion) {
            this.onDoNotKnowQuestion();
          }
        }
      }

    }
    if(!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.notListed].value){
      this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required);
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
    }
  }

  private onDoNotKnowSelected(){
    if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true &&
      !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true) {
      this.disableSexualIdentity.forEach((sexualIdentity: any) => {
        this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
      });
    }
   }

   private onDoNotAnswerSelected(){
    if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
      !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true) {
      this.disableSexualIdentity.forEach((sexualIdentity: any) => {
        this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
      });
    }
   }

   private onDoNotKnowQuestion(){
    if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
      !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true) {
      this.disableSexualIdentity.forEach((sexualIdentity: any) => {
        this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
      });
    }
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
        'SexualIdentityGroup',
        new FormControl('')
      );
      this.SexulaIdentities = data;
      this.disableSexualIdentity = this.SexulaIdentities.filter((x: any) => x.lovCode !== SexualIdentityCode.dontKnow && x.lovCode !== SexualIdentityCode.dontWant && x.lovCode !== SexualIdentityCode.dontKnowQustion);
      this.cdr.detectChanges();
    });
  }

  private updateWorkflowCount(isCompleted: boolean) {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'sexualIdentity',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }
  private loadApplicantInfoSubscription() {
    this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo) => {
      if (applicantInfo !== null) {
        if (applicantInfo.clientSexualIdentityList !== null && applicantInfo.clientSexualIdentityList !== undefined
          && applicantInfo.clientSexualIdentityList.length > 0) {
          this.assignSexualIdentityToForm(applicantInfo.clientSexualIdentityList);
          const otherSexualIdentities = applicantInfo.clientSexualIdentityList.filter((x: any) => x.clientSexualIdentityCode === SexualIdentityCode.dontKnow || x.clientSexualIdentityCode === SexualIdentityCode.dontWant || x.clientSexualIdentityCode === SexualIdentityCode.dontKnowQustion)
          if (otherSexualIdentities.length > 0) {
            this.enableDisableSexualIdentity(true, otherSexualIdentities[0].clientSexualIdentityCode);
          }
          this.updateWorkflowCount(true);
        }
        else{
          this.textboxDisable=true;
          this.enableAllSexualIdentities();
        }
      }
      else{
        this.textboxDisable=true;
        this.enableAllSexualIdentities();
      }
      this.cdr.detectChanges();
    });
  }
  private assignSexualIdentityToForm(clientSexualIdentityList: any) {
    if (Array.isArray(clientSexualIdentityList)) {
      clientSexualIdentityList.forEach(identity => {
        this.appInfoForm.controls[this.ControlPrefix + identity.clientSexualIdentityCode]?.setValue(true);
        if (identity.clientSexualIdentityCode === SexualIdentityCode.notListed && identity.otherDesc !== null) {
          this.appInfoForm.controls['SexualIdentityDescription']?.setValue(identity.otherDesc);
          this.textboxDisable = false;
        }
        this.appInfoForm.controls['SexualIdentityGroup']?.setValue(identity.clientSexualIdentityCode);
      })
      this.cdr.detectChanges();
    }
  }

  enableAllSexualIdentities(){
    if(this.disableSexualIdentity.length>0){
      this.disableSexualIdentity.forEach((sexualIdentity: any) => {
        this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
      });
    }
  }
}
