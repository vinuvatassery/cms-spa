import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HealthInsurancePlan } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-careassist-pay',
  templateUrl: './medical-premium-detail-careassist-pay.component.html',
})
export class MedicalPremiumDetailCareassistPayComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() sameAsInsuranceIdFlag!: boolean;
  @Input() ddlInsuranceType: string = '';
  @Input() clientId: any;
  @Input() caseEligibilityId: any;
  @Input() insuranceStatus: any;

  InsurancePlanTypes: typeof HealthInsurancePlan = HealthInsurancePlan;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  specialCharAdded: boolean = false;
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.lovFacade.getPremiumFrequencyLovs();
  }

  onSameAsInsuranceIdValueChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.sameAsInsuranceIdFlag = true;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(this.healthInsuranceForm.controls['insuranceIdNumber'].value);
    }
    else {
      this.sameAsInsuranceIdFlag = false;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(null);
    }
  }
  restrictSpecialChar(event: any) {
    const status = ((event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 8 || event.charCode == 32 ||
      (event.charCode >= 48 && event.charCode <= 57) ||
      event.charCode == 45);
    if (status) {
      this.healthInsuranceForm.controls['insuranceEndDate'].setErrors(null);
      this.specialCharAdded = false;
    }
    else {
      this.healthInsuranceForm.controls['insuranceIdNumber'].setErrors({ 'incorrect': true });
      this.specialCharAdded = true;
    }
    return status;
  }
}
