import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { VendorFacade } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-medical-premium-detail-insurance-carrier-name',
  templateUrl: './medical-premium-detail-insurance-carrier-name.component.html',
  styleUrls: ['./medical-premium-detail-insurance-carrier-name.component.scss'],
})
export class MedicalPremiumDetailInsuranceCarrierNameComponent
  implements OnInit
{
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;

  @Output() insuranceCarrierNameChange = new EventEmitter<any>();
  @Output() insuranceCarrierNameData = new EventEmitter<any>();
public isaddNewInsuranceProviderOpen =false;
public isLoading =false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  carrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  constructor(
    private formBuilder: FormBuilder,
    private readonly vendorFacade: VendorFacade,
    private readonly loaderService: LoaderService
  ) {
    this.healthInsuranceForm = this.formBuilder.group({
      insuranceCarrierName: [''],
    });
  }

  ngOnInit(): void {
    this.loadInsuranceCarrierName();
  }

  private loadInsuranceCarrierName() {
    this.isLoading=true;
    this.vendorFacade.loadAllVendors().subscribe(
      (data: any) => {
        if (!Array.isArray(data)) return;
        this.carrierNames = data.sort((a: any, b: any) => (a.vendorName > b.vendorName) ? 1 : ((b.vendorName > a.vendorName) ? -1 : 0));
        this.insuranceCarrierNameData.emit(this.carrierNames);
        this.isLoading=false;
      },
      (error: any) => {
        this.isLoading=false;
      }
    );
  }

  public insuranceCarrierNameChangeValue(value: string): void {
    this.insuranceCarrierNameChange.emit(value);
  }

  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.isaddNewInsuranceProviderOpen = true;
  }
}
