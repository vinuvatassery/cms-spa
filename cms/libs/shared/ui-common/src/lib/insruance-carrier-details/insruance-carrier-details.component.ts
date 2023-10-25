import { Input, ChangeDetectionStrategy, Component, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms'; 
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { ConfigurationProvider, LoaderService, } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { FinancialVendorTypeCode } from '../enums/financial-vendor-type-code';
import { StatusFlag } from '../enums/status-flag.enum';
@Component({
  selector: 'cms-insruance-carrier-details',
  templateUrl: './insruance-carrier-details.component.html',
  styleUrls: ['./insruance-carrier-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceCarrierDetailsComponent{
  @Input() providerType!: any;
  @Input() insuranceProviderForm: FormGroup;
  @Input() editVendorInfo: boolean = false;
  @Input() hasCreateUpdatePermission: boolean = false;
  @Output() saveProviderEventClicked = new EventEmitter<any>();
  @Output() closeModalEventClicked = new EventEmitter<any>();
  
  @Output() updateVendorDetailsClicked = new EventEmitter<any>(); 

  public formUiStyle: UIFormStyle = new UIFormStyle();

  isViewContentEditable!: boolean;
  isValidateForm: boolean = false;
constructor(
    private readonly formBuilder: FormBuilder,
 private readonly cdr: ChangeDetectorRef,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
 ) {
    this.insuranceProviderForm = this.formBuilder.group({});
  }

  save() {
     this.validateForm();
    this.isValidateForm = true;
    if (this.insuranceProviderForm.valid) {
      let providerData = this.mappVendorProfileData();
      this.saveProviderEventClicked.next(providerData);
    }
  }

  validateForm() {
    this.insuranceProviderForm.markAllAsTouched();
    if (this.providerType == this.vendorTypes.InsuranceProviders) {
        this.insuranceProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
        this.insuranceProviderForm.controls['providerName'].updateValueAndValidity();
      
    } 
  }
  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  mappVendorProfileData() {
    let formValues = this.insuranceProviderForm.value; 
    const vendorProfileData = this.createVendorProfileData(formValues)
    return vendorProfileData;
  }

 
  closeVedorModal() {
    this.closeModalEventClicked.next(true);
  }  
  createVendorProfileData(formValues :any){
    let vendorProfileData = {
      vendorId: null,
      vendorName: formValues.providerName, 
      vendorTypeCode: this.providerType, 
      vendorContacts: [], 
      activeFlag: (this.hasCreateUpdatePermission) ? StatusFlag.Yes : StatusFlag.No,
    }
    if (this.vendorTypes.InsuranceProviders==this.providerType) {
      vendorProfileData.vendorTypeCode=this.vendorTypes.InsuranceProviders;
    } 
    return vendorProfileData;
  }
get insuranceProviderFormControls() {
  return this.insuranceProviderForm.controls as any;
}
}
