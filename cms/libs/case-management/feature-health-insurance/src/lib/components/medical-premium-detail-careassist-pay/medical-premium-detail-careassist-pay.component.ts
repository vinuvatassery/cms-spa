import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HealthInsurancePlan } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-careassist-pay',
  templateUrl: './medical-premium-detail-careassist-pay.component.html',
  styleUrls: ['./medical-premium-detail-careassist-pay.component.scss'],
})
export class MedicalPremiumDetailCareassistPayComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() sameAsInsuranceIdFlag!: boolean;
  @Input() ddlInsuranceType: string='';
  @Input() clientId: any;

  InsurancePlanTypes: typeof HealthInsurancePlan = HealthInsurancePlan;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ });
  }

  ngOnInit(): void {
    this.lovFacade.getPremiumFrequencyLovs();
  }

  onSameAsInsuranceIdValueChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.sameAsInsuranceIdFlag = true;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(parseInt(this.healthInsuranceForm.controls['insuranceIdNumber'].value) );
    }
    else {
      this.sameAsInsuranceIdFlag = false;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(null);
    }
  }
}
