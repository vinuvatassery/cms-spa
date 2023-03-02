import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {  LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompletionChecklist, StatusFlag, WorkflowFacade, ClientFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';
@Component({
  selector: 'case-management-client-edit-view-sex-at-birth',
  templateUrl: './client-edit-view-sex-at-birth.component.html',
  styleUrls: ['./client-edit-view-sex-at-birth.component.scss'],
})
export class ClientEditViewSexAtBirthComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  @Input() textboxDisable!:boolean;
  ControlPrefix = 'BirthGender';
  DescriptionField = 'BirthGenderDescription';
  Genders: any = [];
  GendersAtBirthLovs$ = this.lovFacade.sexAtBirthlov$;
  applicantInfo$ = this.clientfacade.applicantInfo$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  appInfoSubscription!:Subscription;
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly clientfacade: ClientFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ BirthGenderInit: [''] });
  }

  ngOnInit(): void {
    this.lovFacade.getSexAtBirthLovs();
    this.loadGendersAtBirth();
    this.loadApplicantInfoSubscription();
  }
  private loadGendersAtBirth() {
    this.GendersAtBirthLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;
      this.appInfoForm.addControl(
        'BirthGender',
        new FormControl('')
      );
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.Genders = data;
    });
  }

  private updateWorkflowCount(isCompleted: boolean) {
    const workFlowData: CompletionChecklist[] = [{
      dataPointName: 'birthGenderCode',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowData);
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
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
      this.updateWorkflowCount(true);
      this.textboxDisable=true;
    }
  }

  descriptionChange() {
    this.updateWorkflowCount(this.appInfoForm.controls[this.DescriptionField]?.value ? true : false);
  }

  private loadApplicantInfoSubscription(){
    this.appInfoSubscription = this.applicantInfo$.subscribe((applicantInfo)=>{   
      if(applicantInfo !== null){ 
        if(applicantInfo.client.genderAtBirthCode !== null && applicantInfo.client.genderAtBirthCode !== undefined && applicantInfo.client.genderAtBirthCode !==''){
          this.assignSexAtBirthModelToForm(applicantInfo);
          this.updateWorkflowCount(true);
        } 
        else{
          this.textboxDisable=false;
        }       
      }
    });
    this.cdr.detectChanges();
  }
  
  assignSexAtBirthModelToForm(applicantInfo:any){
    const BirthGender=applicantInfo.client.genderAtBirthCode.trim();
    this.appInfoForm.controls['BirthGender']?.setValue(BirthGender);
    if (BirthGender==='NOT_LISTED') {
      this.appInfoForm.controls['BirthGenderDescription']?.setValue(applicantInfo.client.genderAtBirthDesc);
      this.textboxDisable=false;
    }
    else{
      this.textboxDisable=true;
    }
  }
}
