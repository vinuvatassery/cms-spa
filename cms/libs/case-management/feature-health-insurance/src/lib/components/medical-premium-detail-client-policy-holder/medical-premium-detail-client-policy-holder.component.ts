import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-premium-detail-client-policy-holder',
  templateUrl: './medical-premium-detail-client-policy-holder.component.html',
})
export class MedicalPremiumDetailClientPolicyHolderComponent {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  policyHolderInputMaxLength:number=40;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ });
  } 
}
