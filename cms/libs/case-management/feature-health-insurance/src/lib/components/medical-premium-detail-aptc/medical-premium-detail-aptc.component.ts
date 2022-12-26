import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-medical-premium-detail-aptc',
  templateUrl: './medical-premium-detail-aptc.component.html',
  styleUrls: ['./medical-premium-detail-aptc.component.scss'],
})
export class MedicalPremiumDetailAPTCComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ aptcFlag: [''] });
  }

  ngOnInit(): void {}
}
