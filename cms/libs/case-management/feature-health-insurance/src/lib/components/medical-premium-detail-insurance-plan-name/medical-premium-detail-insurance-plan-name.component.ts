import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import {  LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-insurance-plan-name',
  templateUrl: './medical-premium-detail-insurance-plan-name.component.html',
  styleUrls: ['./medical-premium-detail-insurance-plan-name.component.scss'],
})
export class MedicalPremiumDetailInsurancePlanNameComponent {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insurancePlans: Array<any> = [];
  @Input() insurancePlansLoader: boolean = false;
  
  public isaddNewInsurancePlanOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  CarrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  constructor(private formBuilder: FormBuilder,private readonly lovFacade: LovFacade) {
    this.healthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: [''] });
  }
  
  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

}
