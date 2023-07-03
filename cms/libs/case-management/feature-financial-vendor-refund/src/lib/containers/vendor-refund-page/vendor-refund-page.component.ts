/** Angular **/
import { Component  } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html', 
})
export class VendorRefundPageComponent   {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialVendorRefundFacade.sortValueRefundProcess;
   sortType = this.financialVendorRefundFacade.sortType;
   pageSizes = this.financialVendorRefundFacade.gridPageSizes;
   gridSkipCount = this.financialVendorRefundFacade.skipCount;
   sort = this.financialVendorRefundFacade.sortProcessList;
   state!: State;
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

  loadVendorRefundAllPaymentsListGrid(event: any) {
  
    this.financialVendorRefundFacade.loadVendorRefundAllPaymentsListGrid();
  }
}
