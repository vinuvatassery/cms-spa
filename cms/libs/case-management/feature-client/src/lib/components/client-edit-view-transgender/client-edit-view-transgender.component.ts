import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompletionChecklist, StatusFlag, WorkflowFacade, TransGenderCode } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-client-edit-view-transgender',
  templateUrl: './client-edit-view-transgender.component.html',
  styleUrls: ['./client-edit-view-transgender.component.scss'],
})
export class ClientEditViewTransgenderComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  ControlPrefix = 'Transgender';
  DescriptionField = 'TransgenderDescription';
  Transgenders: any = [];
  yesGendersList: any =[];
  TransgenderLovs$ = this.lovFacade.transgenderlov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ TransgenderInit: [''] });
  }

  ngOnInit(): void {
    this.loadTransgenders();
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
    } else {
      this.appInfoForm.controls[this.DescriptionField].removeValidators(
        Validators.required
      );
      this.appInfoForm.controls[
        this.DescriptionField
      ].updateValueAndValidity();
      this.updateWorkflowCount(true);
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
}
