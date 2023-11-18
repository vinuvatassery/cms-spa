import {  ChangeDetectionStrategy,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
import { DocumentFacade } from 'libs/shared/util-core/src/lib/application/document-facade';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cms-refund-batch-page',
  templateUrl: './refund-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchPageComponent  implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  paymentBatchName$ =  this.financialClaimsFacade.paymentBatchName$; 
   sortValue = this.financialVendorRefundFacade.sortValueBatchLog;
   sortType = this.financialVendorRefundFacade.sortType;
   pageSizes = this.financialVendorRefundFacade.gridPageSizes;
   gridSkipCount = this.financialVendorRefundFacade.skipCount;
   sort = this.financialVendorRefundFacade.sortBatchLogList;
   exportButtonShow$ = this.documentFacade.exportButtonShow$;
   state!: State;
   batchLogGridLists$ = this.financialVendorRefundFacade.batchLogData$;
   batchesLogGridExportParameters = null
   batchId =null
  constructor( 
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade ,
    private documentFacade: DocumentFacade,
    private readonly route: ActivatedRoute,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
  ) {}

  ngOnInit(): void {
    
    this.batchId =   this.route.snapshot.queryParams['b_id']; 
    this.loadBatchName();
  }

  loadBatchLogListGrid(loadBatchLogListRequestDto : any) { 
    this.batchesLogGridExportParameters = loadBatchLogListRequestDto
    this.financialVendorRefundFacade.selectedRefundsTab =2 
    const batchId = this.route.snapshot.queryParams['b_id'];
    this.financialVendorRefundFacade.loadBatchLogListGrid(loadBatchLogListRequestDto,batchId);
  }

  loadBatchName(){
    const batchId = this.route.snapshot.queryParams['b_id'];
    this.financialClaimsFacade.loadBatchName(batchId);
  }
  exportBatchesLogGridData()
  {
    const batchId = this.route.snapshot.queryParams['b_id'];
    if (this.batchesLogGridExportParameters) {       
      this.documentFacade.getExportFile(this.batchesLogGridExportParameters, `vendor-refund-batches/${batchId}/payments`,'Batch Refunds');
    }
  }
}
