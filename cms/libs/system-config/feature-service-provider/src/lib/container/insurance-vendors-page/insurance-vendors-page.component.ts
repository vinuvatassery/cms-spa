import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentFacade } from '@cms/shared/util-core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-insurance-vendors-page',
  templateUrl: './insurance-vendors-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceVendorsPageComponent {
  state!: State;
  sortType = this.systemConfigServiceProviderFacade.sortType;
  pageSizes = this.systemConfigServiceProviderFacade.gridPageSizes;
  gridSkipCount = this.systemConfigServiceProviderFacade.skipCount;
  sortValueInsVendors = this.systemConfigServiceProviderFacade.sortValueInsVendors;
  sortInsVendorsGrid = this.systemConfigServiceProviderFacade.sortInsVendorsGrid;
  insVendorsService$ = this.systemConfigServiceProviderFacade.loadInsuranceVendorsListsService$; 
  exportButtonShow$ = this.documentFacade.exportButtonShow$
  dataExportParameters!: any
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade,
    private documentFacade: DocumentFacade,
  ) { }
 
  // loadInsVendorsLists(data: any){
  //   this.systemConfigServiceProviderFacade.loadInsuranceVendorsLists();
  // }
  loadInsVendorsLists(data: any) {
    // this.financialVendorFacade.selectedVendorType = data?.vendorTypeCode.includes('CLINIC') ? data?.vendorTypeCode.split(',')[0] : data?.vendorTypeCode;
   this.dataExportParameters = data
    this.systemConfigServiceProviderFacade.loadInsuranceVendorsLists(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType, data?.vendorTypeCode, data?.filter)
  }
  exportGridData() {
    debugger
    const data = this.dataExportParameters
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest =
      {
        vendorTypeCode: data?.vendorTypeCode,
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipCount,
        MaxResultCount: data?.pagesize,
        Filter: filter
      }
      let fileName = 'Insurance Vendors'
      this.documentFacade.getExportFile(vendorPageAndSortedRequest, 'vendors', fileName)
    }
  }
}
