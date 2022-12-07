import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovDataService, LovType } from '@cms/system-config/domain';

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
  constructor(
    private readonly lovDataService: LovDataService,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ TransgenderInit: [''] });
  }

  ngOnInit(): void {
    this.lovDataService.getLovsbyType(LovType.Transgender).subscribe((data) => {
      if (!Array.isArray(data)) return;

      this.appInfoForm.addControl('Transgender', new FormControl('',[Validators.required]));
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.Transgenders = data;
    });
  }

  onTransgenderRdoClicked(lovCode: string) {
    if (lovCode === 'NOT_LISTED') {
      this.appInfoForm.controls[this.DescriptionField].setErrors({
        incorrect: true,
      });
    } else {
      this.appInfoForm.controls[this.DescriptionField].setErrors(null);
      this.appInfoForm.controls[this.DescriptionField].setValue('');
    }
  }
}
