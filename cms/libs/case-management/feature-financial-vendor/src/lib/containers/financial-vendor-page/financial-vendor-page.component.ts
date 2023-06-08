import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CaseFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, SearchHeaderType } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorPageComponent implements OnInit{
  isVendorDetailFormShow = false;
  isMedicalProvider: boolean = false;
  medicalProviderForm: FormGroup;

  data = [
    {
      text: 'Manufacture',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Medical Provider',
      click: (dataItem: any): void => {
        this.isMedicalProvider = true;
        this.buildMPForm();
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Insurance Vendor',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Pharmacy',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
      
    },
    {
      text: 'Dental Provider',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
      
    },
  ];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll(); 

  vendorsList$ = this.financialVendorFacade.vendorsList$
  pageSizes = this.financialVendorFacade.gridPageSizes;
  sortValue  = this.financialVendorFacade.sortValue;
  sortType  = this.financialVendorFacade.sortType;
  sort  = this.financialVendorFacade.sort;

  constructor(private caseFacade: CaseFacade , private financialVendorFacade : FinancialVendorFacade,
    private readonly formBuilder: FormBuilder) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

    /** Lifecycle hooks **/
    ngOnInit() {    
      this.caseFacade.enableSearchHeader(SearchHeaderType.VendorSearch);
    }

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  get financeVendorTypeCodes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  clickOpenVendorDetails(dataItem : any) {
    this.isVendorDetailFormShow = true;
  
  }
  clickCloseVendorDetails() {
    this.isVendorDetailFormShow = false;
  }

  loadFinancialVendorsList(data : any)
  {   
    
    this.financialVendorFacade.getVendors(data?.skipCount,data?.pagesize,data?.sortColumn,data?.sortType,data?.vendorTypeCode)
  }

  buildMPForm() {
    this.medicalProviderForm = this.formBuilder.group({
      providerName: ['', Validators.required],
      tinNumber: [''],
      paymentMethodRB: [''],
      specialHandling: [''],
      mailCode: [''],
      nameOnCheck: [''],
      nameOnEnvolop: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: [''],
      newAddContactForm: this.formBuilder.array([
        this.formBuilder.group({
          contactName: new FormControl('', Validators.maxLength(40)),
          description: new FormControl(),
          phoneNumber: new FormControl(),
          fax: new FormControl(),
          email: new FormControl()
        })
      ]),
    });
  }


}
