/** Angular **/
import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { ApiType, DocumentFacade } from '@cms/shared/util-core';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
})
export class VendorRefundPageComponent {

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  tab = 1
  dataExportParameters = null
  batchesGridExportParameters = null
  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;

  sortValueRefundProcess = this.financialVendorRefundFacade.sortValueRefundProcess;
  sortProcessList = this.financialVendorRefundFacade.sortProcessList;
  sortValueRefundBatch = this.financialVendorRefundFacade.sortValueRefundBatch;
  sortBatchList = this.financialVendorRefundFacade.sortBatchList;
  sortValueRefundPayments = this.financialVendorRefundFacade.sortValueRefundPayments;
  sortPaymentsList = this.financialVendorRefundFacade.sortPaymentsList;
  state!: State;
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

  loadVendorRefundBatchListGrid(loadBatchListRequestDto: any) {
    this.financialVendorRefundFacade.selectedRefundsTab = 2;
    this.tab = this.financialVendorRefundFacade.selectedRefundsTab;
    this.batchesGridExportParameters = loadBatchListRequestDto;
    this.financialVendorRefundFacade.loadVendorRefundBatchListGrid(loadBatchListRequestDto);
  }

  loadVendorRefundAllPaymentsListGrid(recentClaimsPageAndSortedRequestDto : any) {
    this.financialVendorRefundFacade.selectedRefundsTab = 1;
    this.tab = this.financialVendorRefundFacade.selectedRefundsTab;   
    this.dataExportParameters = recentClaimsPageAndSortedRequestDto;    
    this.financialVendorRefundFacade.loadVendorRefundAllPaymentsListGrid(recentClaimsPageAndSortedRequestDto);
  }

  loadFinancialRefundProcessListGrid(data: any) {
    this.financialVendorRefundFacade.selectedClaimsTab = 1;
    this.tab = this.financialVendorRefundFacade.selectedClaimsTab;
    this.dataExportParameters = data;
    this.financialVendorRefundFacade.loadFinancialRefundProcessListGrid(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,
    );
  }

  loadRefundPaymentsListGrid(data: any) {
    this.financialVendorRefundFacade.selectedClaimsTab = 1;
    this.tab = this.financialVendorRefundFacade.selectedClaimsTab;
    this.dataExportParameters = data;
    this.financialVendorRefundFacade.loadRefundReceiptLogListService(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,

    );
  }

  exportAllRefundsGridData(data: any) {
    let gridData = data.gridData;
    let selectedPayments = data.selectedPayments;

    if (data) {
      const filter = JSON.stringify(gridData?.filter);

      const vendorPageAndSortedRequest = {
        SortType: gridData?.sortType,
        Sorting: gridData?.sortColumn,
        SkipCount: gridData?.skipcount,
        MaxResultCount: gridData?.maxResultCount,
        Filter: filter,
      };
      let fileName = 'Refund Payments';

      this.documentFacade.getExportFileForSelction(
        vendorPageAndSortedRequest,
        `vendor-refunds/receipting-log`,
        fileName,
        ApiType.CaseApi,
        selectedPayments
      );
    }
  }

  pageTitle = "Vendor Refunds";
  changeTitle(data: any): void {
    this.pageTitle = data ?? "Vendor Refunds";
  }

  exportBatchesGridData() {
    if (this.batchesGridExportParameters) {
      this.documentFacade.getExportFile(this.batchesGridExportParameters, `vendor-refunds/batches`, 'All Batches');
    }
  }

}
