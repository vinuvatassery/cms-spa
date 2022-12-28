import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import {  LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-insurance-plan-name',
  templateUrl: './medical-premium-detail-insurance-plan-name.component.html',
  styleUrls: ['./medical-premium-detail-insurance-plan-name.component.scss'],
})
export class MedicalPremiumDetailInsurancePlanNameComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insurancePlans: Array<any> = [];
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

  ngOnInit(): void {
   // this.lovFacade.getInsuranceCarrierNameLovs();
    this.loadInsuranceCarrierName();

  }

  private loadInsuranceCarrierName() {
    // this.insuranceCarrierNamelov$.subscribe((data:any) => {
    //   if (!Array.isArray(data)) return;
    //   this.CarrierNames = data;
    // });
  }
  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

}
