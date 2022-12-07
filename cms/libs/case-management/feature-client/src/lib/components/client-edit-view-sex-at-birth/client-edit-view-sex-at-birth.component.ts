import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovDataService, LovType } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-sex-at-birth',
  templateUrl: './client-edit-view-sex-at-birth.component.html',
  styleUrls: ['./client-edit-view-sex-at-birth.component.scss'],
})
export class ClientEditViewSexAtBirthComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  ControlPrefix = 'BirthGender';
  DescriptionField = 'BirthGenderDescription';
  Genders: any = [];
  constructor(
    private readonly lovDataService: LovDataService,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ BirthGenderInit: [''] });
  }

  ngOnInit(): void {
    this.lovDataService.getLovsbyType(LovType.SexAtBirth).subscribe((data) => {
      if (!Array.isArray(data)) return;
      this.appInfoForm.addControl('BirthGender', new FormControl('',[Validators.required]));
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.Genders = data;
    });
  }
  onTransgenderRdoClicked(lovCode: string) {
    if (lovCode === 'NOT_LISTED') {
      this.appInfoForm.controls[this.DescriptionField].setValidators(Validators.required);
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
    } else {
      this.appInfoForm.controls[this.DescriptionField].removeValidators(Validators.required);
      this.appInfoForm.controls[this.DescriptionField].updateValueAndValidity();
    }
  }
}
