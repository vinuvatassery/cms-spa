/** Angular **/
import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DocumentFacade} from '@cms/shared/util-core';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
})
export class VendorRefundPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   tab = 1
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
   dataExportParameters!: any;
  vendorRefundProcessGridLists$ =
    this.financialVendorRefundFacade.vendorRefundProcessData$;
  vendorRefundBatchGridLists$ = this.financialVendorRefundFacade.vendorRefundBatchData$;

  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
  constructor( 
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade ,
    private documentFacade: DocumentFacade,
  ) {}


  loadVendorRefundProcessListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }


  loadVendorRefundBatchListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundBatchListGrid();
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
  
  //exportButtonShow$ = this.documentFacade.exportButtonShow$;

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
        `refund/logs`,
        fileName
      );
    }
  }
}
