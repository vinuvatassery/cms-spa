import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  ControlPrefix = 'Gender';
  DescriptionField = 'GenderDescription';
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ Gender: [''] });
  }
  Genders: any = [];
  ngOnInit(): void {
    this.lovFacade.getGenderLovs();
    this.loadGendersLov();
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

  onCheckChange(event: any, lovCode: string) {
    if (event.target.checked) {
      this.appInfoForm.controls['GenderGroup'].setValue(lovCode);
      if (lovCode === 'NOT_LISTED') {
        this.appInfoForm.controls[this.DescriptionField].setErrors({
          incorrect: true,
        });
      }
    } else {
      this.appInfoForm.controls['GenderGroup'].setValue('');

      if (lovCode === 'NOT_LISTED') {
        this.appInfoForm.controls[this.DescriptionField].setErrors(null);
        this.appInfoForm.controls[this.DescriptionField].setValue('');
      }
    }
  }
}
