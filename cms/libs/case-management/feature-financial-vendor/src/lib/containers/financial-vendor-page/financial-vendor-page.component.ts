import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CaseFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, SearchHeaderType } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorPageComponent implements OnInit{
  isVendorDetailFormShow = false;

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

  constructor(private caseFacade: CaseFacade , private financialVendorFacade : FinancialVendorFacade) {}

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


}
