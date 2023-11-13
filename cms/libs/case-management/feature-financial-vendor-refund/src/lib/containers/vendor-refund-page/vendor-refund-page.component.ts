/** Angular **/
import {  Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html', 
})
export class VendorRefundPageComponent    {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   tab = 1
   dataExportParameters = null
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
   tab = 1;
   dataExportParameters!: any;
   selectedClaimsTab = 1;
  vendorRefundProcessGridLists$ =
  this.financialVendorRefundFacade.vendorRefundProcessData$;
  vendorRefundBatchGridLists$ = this.financialVendorRefundFacade.vendorRefundBatchData$;

  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
  constructor( 
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade 
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
}
