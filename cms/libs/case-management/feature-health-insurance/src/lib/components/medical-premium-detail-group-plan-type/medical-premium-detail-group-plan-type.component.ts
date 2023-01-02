import { Component, Input, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'case-management-medical-premium-detail-group-plan-type',
  templateUrl: './medical-premium-detail-group-plan-type.component.html',
  styleUrls: ['./medical-premium-detail-group-plan-type.component.scss'],
})
export class MedicalPremiumDetailGroupPlanTypeComponent implements OnInit {
  @Input() isViewContentEditable!: boolean;
  @Input() healthInsuranceForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {}
}
