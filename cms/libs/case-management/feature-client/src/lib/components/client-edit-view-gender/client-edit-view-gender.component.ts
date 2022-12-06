import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovDataService, LovType } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-gender',
  templateUrl: './client-edit-view-gender.component.html',
  styleUrls: ['./client-edit-view-gender.component.scss'],
})
export class ClientEditViewGenderComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
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
      this.appInfoForm.addControl(
       this.DescriptionField,
        new FormControl('')
      );
      this.Genders = data;
    });
  }

  onCheckChange(event: any, lovCode: any) {
    if (event.target.checked && lovCode === 'NOT_LISTED') {
      //this.appInfoForm.controls[this.DescriptionField].setValidators([Validators.required]);
      this.appInfoForm.controls[this.DescriptionField].setErrors({
        incorrect: true,
      });
    }
    if (!event.target.checked && lovCode === 'NOT_LISTED') {
     //this.appInfoForm.controls[this.DescriptionField].clearValidators();
      this.appInfoForm.controls[this.DescriptionField].setErrors(
        null
      );
    }
  }
}
