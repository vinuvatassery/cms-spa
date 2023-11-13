/** Angular **/
import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
})
export class VendorRefundPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();


  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;

   sortValueRefundProcess = this.financialVendorRefundFacade.sortValueRefundProcess;
   sortProcessList = this.financialVendorRefundFacade.sortProcessList;
   sortValueRefundBatch = this.financialVendorRefundFacade.sortValueRefundBatch;
   sortBatchList = this.financialVendorRefundFacade.sortBatchList;
   sortValueRefundPayments = this.financialVendorRefundFacade.sortValueRefundPayments;
   sortPaymentsList = this.financialVendorRefundFacade.sortPaymentsList;
   state!: State;
   selectedClaimsTab = 1;
   selectedClaimsTab = 1;
  vendorRefundProcessGridLists$ =
    this.financialVendorRefundFacade.vendorRefundProcessData$;
  vendorRefundBatchGridLists$ = this.financialVendorRefundFacade.vendorRefundBatchData$;

  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private documentFacade: DocumentFacade,
  ) { }


  loadVendorRefundProcessListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }


  loadVendorRefundBatchListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundBatchListGrid();
  }

  loadVendorRefundAllPaymentsListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundAllPaymentsListGrid();
  }

  dataExportParameters!: any;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;

  exportClaimsPaymentsGridData(data: any) {
    // const data = this.dataExportParameters;
    // alert(JSON.stringify(data))
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest = {
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipcount,
        MaxResultCount: data?.maxResultCount,
        Filter: filter,
      };
      // let fileName =
      //   this.claimsType[0].toUpperCase() +
      //   this.claimsType.substr(1).toLowerCase() +
      //   ' Claims Payments';
      let fileName = ' Claims Payments';

      // this.documentFacade.getExportFile(
      //   vendorPageAndSortedRequest,
      //   `claims/${this.claimsType}/payments`,
      //   fileName
      // );
      this.documentFacade.getExportFile(
        vendorPageAndSortedRequest,
        `claims/test/payments`,
        fileName
      );
    }
  }
}
