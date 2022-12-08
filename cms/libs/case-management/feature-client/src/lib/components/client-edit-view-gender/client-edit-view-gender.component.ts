import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovDataService, LovType } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-gender',
  templateUrl: './client-edit-view-gender.component.html',
  styleUrls: ['./client-edit-view-gender.component.scss'],
})
export class ClientEditViewGenderComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  ControlPrefix = 'Gender';
  DescriptionField = 'GenderDescription';
  constructor(
    private readonly lovDataService: LovDataService,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ Gender: [''] });
  }
  Genders: any = [];
  ngOnInit(): void {
    this.lovDataService.getLovsbyType(LovType.Gender).subscribe((data) => {
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
        new FormControl('', [Validators.required])
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
