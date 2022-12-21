import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';
import { VendorFacade } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-medical-premium-detail-insurance-carrier-name',
  templateUrl: './medical-premium-detail-insurance-carrier-name.component.html',
  styleUrls: ['./medical-premium-detail-insurance-carrier-name.component.scss'],
})
export class MedicalPremiumDetailInsuranceCarrierNameComponent implements OnInit{
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;

  @Output() insuranceCarrierNameChange = new EventEmitter<any>();
  @Output() insuranceCarrierNameData = new EventEmitter<any>();

  public formUiStyle : UIFormStyle = new UIFormStyle();
  CarrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  constructor(private formBuilder: FormBuilder,private readonly vendorFacade:VendorFacade) {
    this.healthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: ['']   })
  }

  ngOnInit(): void {
    this.loadInsuranceCarrierName();

  }

  private loadInsuranceCarrierName() {
    this.vendorFacade.loadAllVendors().subscribe((data:any) => {
      if (!Array.isArray(data)) return;
      this.CarrierNames = data;
      this.insuranceCarrierNameData.emit(data);
    });
  }

  public insuranceCarrierNameChangeValue(value: string): void {
    this.insuranceCarrierNameChange.emit(value);
  }
}
