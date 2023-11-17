import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-refund-batch-page',
  templateUrl: './refund-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchPageComponent   {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialVendorRefundFacade.sortValueBatchLog;
   sortType = this.financialVendorRefundFacade.sortType;
   pageSizes = this.financialVendorRefundFacade.gridPageSizes;
   gridSkipCount = this.financialVendorRefundFacade.skipCount;
   sort = this.financialVendorRefundFacade.sortBatchLogList;
   state!: State;
   batchLogGridLists$ = this.financialVendorRefundFacade.batchLogData$;
  constructor( 
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade 
  ) {}

  loadBatchLogListGrid(loadBatchLogListRequestDto : any) { 
    this.financialVendorRefundFacade.loadBatchLogListGrid(loadBatchLogListRequestDto);
  }
}
