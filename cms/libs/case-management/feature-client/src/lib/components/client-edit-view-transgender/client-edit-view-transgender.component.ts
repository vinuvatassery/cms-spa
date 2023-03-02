import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompletionChecklist, StatusFlag, WorkflowFacade, TransGenderCode, ClientFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';
@Component({
  selector: 'case-management-client-edit-view-transgender',
  templateUrl: './client-edit-view-transgender.component.html',
  styleUrls: ['./client-edit-view-transgender.component.scss'],
})
export class ClientEditViewTransgenderComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  @Input() textboxDisable!:boolean;
  ControlPrefix = 'Transgender';
  DescriptionField = 'TransgenderDescription';
  Transgenders: any = [];
  yesGendersList: any =[];
  TransgenderLovs$ = this.lovFacade.transgenderlov$;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  appInfoSubscription!:Subscription;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder,
    private readonly clientfacade: ClientFacade,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.appInfoForm = this.formBuilder.group({ TransgenderInit: [''] });
  }

  ngOnInit(): void {
    this.lovFacade.getTransgenderLovs();
    this.loadTransgenders();
    this.loadApplicantInfoSubscription();
  }
  private loadTransgenders() {
    this.TransgenderLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;

      this.appInfoForm.addControl(
        'Transgender',
        new FormControl('')
      );
      this.appInfoForm.addControl(
        'yesTransgender',
        new FormControl('')
      );
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.Transgenders = data.filter((x:any)=>x.lovCode !== TransGenderCode.dontKnow 
      && x.lovCode !== TransGenderCode.dontKnowQustion && x.parentCode != TransGenderCode.yesParentCode);
      this.yesGendersList = data.filter((x: any)=> x.parentCode == TransGenderCode.yesParentCode);
    });
  }

  private updateWorkflowCount(isCompleted: boolean) {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'transgenderCode',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  onTransgenderRdoClicked(lovCode: string) {
    if (lovCode === 'NOT_LISTED') {
      this.appInfoForm.controls[this.DescriptionField].setValidators(
        Validators.required
      );
      this.descriptionChange();
      this.textboxDisable=false;
    } else {
      this.appInfoForm.controls[this.DescriptionField].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls[
        this.DescriptionField
      ].updateValueAndValidity();
      this.updateWorkflowCount(true);
      this.textboxDisable=true;
    }
    if(lovCode === TransGenderCode.YES) {
      this.appInfoForm.controls['yesTransgender'].setValidators(
        Validators.required
      );
    }
  }

  descriptionChange() {
    this.updateWorkflowCount(this.appInfoForm.controls[this.DescriptionField]?.value ? true : false);
  }

  private loadApplicantInfoSubscription(){
    this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{   
      if(applicantInfo !== null){ 
        if(applicantInfo.client?.clientTransgenderCode !== null && applicantInfo.client?.clientTransgenderCode !== undefined){
          this.assignTransgenderModelToForm(applicantInfo);
          this.updateWorkflowCount(true);
        } 
        else{
          this.textboxDisable=false;
        }       
      }
    });
    this.cdr.detectChanges();
}

assignTransgenderModelToForm(applicantInfo:any){
  const Transgender=applicantInfo.client?.clientTransgenderCode?.trim();
  this.textboxDisable=true;
  if(Transgender == TransGenderCode.YES_F_TO_M || Transgender == TransGenderCode.YES_M_TO_F) {
    this.appInfoForm.controls['Transgender']?.setValue(TransGenderCode.YES);
    this.appInfoForm.controls['yesTransgender']?.setValue(Transgender);
  }
  else {
    this.appInfoForm.controls['Transgender']?.setValue(Transgender);
  }
  if (Transgender==='NOT_LISTED') {
    this.appInfoForm.controls['TransgenderDescription']?.setValue(applicantInfo.client.clientTransgenderDesc);
    this.textboxDisable=false;
  }
}
}
