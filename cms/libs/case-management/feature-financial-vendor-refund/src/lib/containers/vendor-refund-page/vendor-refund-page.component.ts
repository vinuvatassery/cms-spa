/** Angular **/
import {  Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
import { DocumentFacade } from 'libs/shared/util-core/src/lib/application/document-facade';
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
   exportButtonShow$ = this.documentFacade.exportButtonShow$;

   sortValueRefundProcess = this.financialVendorRefundFacade.sortValueRefundProcess;
   sortProcessList = this.financialVendorRefundFacade.sortProcessList;
   sortValueRefundBatch = this.financialVendorRefundFacade.sortValueRefundBatch;
   sortBatchList = this.financialVendorRefundFacade.sortBatchList;
   sortValueRefundPayments = this.financialVendorRefundFacade.sortValueRefundPayments;
   sortPaymentsList = this.financialVendorRefundFacade.sortPaymentsList;
   

   state!: State;
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

  exportAllRefundsGridData() {   
    if (this.dataExportParameters) {       
      this.documentFacade.getExportFile(this.dataExportParameters, `vendor-refunds/all`,'All Refunds');
    }
  }
}
