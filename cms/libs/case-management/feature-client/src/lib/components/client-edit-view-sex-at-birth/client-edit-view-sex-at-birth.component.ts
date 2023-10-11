import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import {  LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompletionChecklist, WorkflowFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
@Component({
  selector: 'case-management-client-edit-view-sex-at-birth',
  templateUrl: './client-edit-view-sex-at-birth.component.html',
})
export class ClientEditViewSexAtBirthComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  ControlPrefix = 'BirthGender';
  DescriptionField = 'BirthGenderDescription';
  Genders: any = [];
  GendersAtBirthLovs$ = this.lovFacade.sexAtBirthlov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private readonly lovFacade: LovFacade,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.appInfoForm = this.formBuilder.group({ BirthGenderInit: [''] });
  }

  ngOnInit(): void {
    this.loadGendersAtBirth();
    this.detectFormChange()
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
      this.descriptionChange();
    } else {
      this.updateWorkflowCount(true);
    }
  }

  descriptionChange() {
    this.updateWorkflowCount(this.appInfoForm.controls[this.DescriptionField]?.value ? true : false);
  }

  detectFormChange() {
    this.appInfoForm?.get('BirthGender')?.valueChanges.subscribe((changedValue: any) => {
      if (changedValue && changedValue != "" && changedValue == 'NOT_LISTED') {
        this.appInfoForm.controls['BirthGenderDescription'].enable();
        this.cdr.detectChanges();
      }
      else {
        this.appInfoForm.controls['BirthGenderDescription'].disable();
        this.cdr.detectChanges();
      }
    })
  }
}
