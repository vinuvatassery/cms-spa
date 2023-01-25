import { Component, Input, OnInit, OnDestroy,ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompletionChecklist, StatusFlag, WorkflowFacade, SexualIdentityCode, ClientFacade, ControlPrefix } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-client-edit-view-sexual-identity',
  templateUrl: './client-edit-view-sexual-identity.component.html',
  styleUrls: ['./client-edit-view-sexual-identity.component.scss'],
})
export class ClientEditViewSexualIdentityComponent implements OnInit, OnDestroy {
  @Input() appInfoForm: FormGroup;

  SexulaIdentityLovs$ = this.lovFacade.sexulaIdentitylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ControlPrefix = ControlPrefix.sexualIdentity;
  DescriptionField = 'SexualIdentityDescription';
  disableSexualIdentity: any;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  appInfoSubscription!: Subscription;
  private countOfSelection = 0;
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
    this.lovFacade.getSexulaIdentityLovs();
    this.loadSexulaIdentities();
    this.formChangeSubscription();
    this.loadApplicantInfoSubscription();
  }
  ngOnDestroy(): void {
    this.appInfoSubscription.unsubscribe();
  }  
  setControlValidations() {
    const sexulaIdentity = Object.keys(this.appInfoForm.controls).filter(m => m.includes(this.ControlPrefix));
    sexulaIdentity.forEach((gender: any) => {
      this.appInfoForm.controls[gender].removeValidators(Validators.requiredTrue);
      this.appInfoForm.controls[gender].updateValueAndValidity();
    });
  }
  onCheckChange(event: any, lovCode: string) {
    this.appInfoForm.controls['SexualIdentityGroup'].removeValidators(Validators.required);
    this.appInfoForm.controls['SexualIdentityGroup'].updateValueAndValidity();
    this.enableDisableSexualIdentity(event.target.checked, lovCode); 
    this.setControlValidations();
  }
  enableDisableSexualIdentity(checked: boolean, lovCode: any) {  
    switch (lovCode) {
      case SexualIdentityCode.dontKnow:
      case SexualIdentityCode.dontWant:
      case SexualIdentityCode.dontKnowQustion: {
        if (checked) {
          this.disableSexualIdentity.forEach((sexualIdentity: any) => {
            this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].setValue(false);
            this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].disable();
            this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required);
          });
          break;
        }
        else {
          if (lovCode === SexualIdentityCode.dontKnow) {
            if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true &&
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true) {
              this.disableSexualIdentity.forEach((sexualIdentity: any) => {
                this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
              });
            }
          }
          if (lovCode === SexualIdentityCode.dontWant) {
            if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnowQustion].value === true) {
              this.disableSexualIdentity.forEach((sexualIdentity: any) => {
                this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
              });
            }
          }
          if (lovCode === SexualIdentityCode.dontKnowQustion) {
            if (!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontKnow].value === true &&
              !this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.dontWant].value === true) {
              this.disableSexualIdentity.forEach((sexualIdentity: any) => {
                this.appInfoForm.controls[this.ControlPrefix + sexualIdentity.lovCode].enable();
              });
            }
          }
        }
      }

    }
    if(!this.appInfoForm.controls[this.ControlPrefix + SexualIdentityCode.notListed].value){
      this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required);
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
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

  private formChangeSubscription() {
    this.appInfoForm.controls['SexualIdentityGroup'].valueChanges.subscribe(value => {
      if (value && this.countOfSelection >= 0) {
        this.updateWorkflowCount(true);
        this.countOfSelection++;
      }
      else {
        this.countOfSelection = this.countOfSelection > 0 ? --this.countOfSelection : this.countOfSelection;
        if (this.countOfSelection <= 0) {
          this.updateWorkflowCount(false);
        }
      }
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
          var otherSexualIdentities = applicantInfo.clientSexualIdentityList.filter((x: any) => x.clientSexualIdentityCode === SexualIdentityCode.dontKnow || x.clientSexualIdentityCode === SexualIdentityCode.dontWant || x.clientSexualIdentityCode === SexualIdentityCode.dontKnowQustion)
          if (otherSexualIdentities.length > 0) {
            this.enableDisableSexualIdentity(true, otherSexualIdentities[0].clientSexualIdentityCode);
          }
          this.updateWorkflowCount(true);
        }        
      }
    });
  }
  private assignSexualIdentityToForm(clientSexualIdentityList: any) {
    if (Array.isArray(clientSexualIdentityList)) {
      clientSexualIdentityList.forEach(identity => {
        this.appInfoForm.controls[this.ControlPrefix + identity.clientSexualIdentityCode]?.setValue(true);
        if (identity.clientSexualIdentityCode === SexualIdentityCode.notListed && identity.otherDesc !== null) {
          this.appInfoForm.controls['SexualIdentityDescription']?.setValue(identity.otherDesc);
        }
        this.appInfoForm.controls['SexualIdentityGroup']?.setValue(identity.clientSexualIdentityCode);       
      })
      this.cdr.detectChanges();
    }
  }
}
