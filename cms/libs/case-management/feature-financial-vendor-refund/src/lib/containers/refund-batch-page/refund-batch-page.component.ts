import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DocumentFacade } from 'libs/shared/util-core/src/lib/application/document-facade';
import { ActivatedRoute } from '@angular/router';
import { ApiType } from '@cms/shared/util-core';

@Component({
  selector: 'cms-refund-batch-page',
  templateUrl: './refund-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  paymentBatchName$ = this.financialClaimsFacade.paymentBatchName$;
  sortValue = this.financialVendorRefundFacade.sortValueBatchLog;
  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;
  sort = this.financialVendorRefundFacade.sortBatchLogList;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  state!: State;
  batchLogGridLists$ = this.financialVendorRefundFacade.batchLogData$;
  batchesLogGridExportParameters = null
  batchId = null
  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private documentFacade: DocumentFacade,
    private readonly route: ActivatedRoute,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
  ) { }

  ngOnInit(): void {

    this.batchId = this.route.snapshot.queryParams['b_id'];
    this.loadBatchName();
  }

  pageTitle = "Vendor Refunds";
  changeTitle(data: any): void {
    this.pageTitle = data ?? "Vendor Refunds";
  }

  loadBatchLogListGrid(loadBatchLogListRequestDto: any) {
    this.batchesLogGridExportParameters = loadBatchLogListRequestDto
    this.financialVendorRefundFacade.selectedRefundsTab = 2
    const batchId = this.route.snapshot.queryParams['b_id'];
    this.financialVendorRefundFacade.loadBatchLogListGrid(loadBatchLogListRequestDto, batchId);
  }

  loadBatchName() {
    const batchId = this.route.snapshot.queryParams['b_id'];
    this.financialClaimsFacade.loadBatchName(batchId);
  }
  exportBatchesLogGridData() {
    const batchId = this.route.snapshot.queryParams['b_id'];
    if (this.batchesLogGridExportParameters) {
      this.documentFacade.getExportFile(this.batchesLogGridExportParameters, `vendor-refund-batches/${batchId}/payments`, 'Batch Refunds');
    }
  }

  dataExportParameters :any;
  exportReceiptDataEvent(data: any) {
    const gridDataResult = data.gridDataResult;
    if (data) {
      const filter = JSON.stringify(gridDataResult?.filter);

      const exportGridParams = {
        SortType: gridDataResult?.sortType,
        Sorting: gridDataResult?.sortColumn,
        SkipCount: gridDataResult?.skipcount,
        MaxResultCount: gridDataResult?.maxResultCount,
        Filter: filter,
      };
      this.dataExportParameters = exportGridParams;

      const formattedDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.');
      this.documentFacade.getExportFileForSelection(this.dataExportParameters, `vendor-refunds/batch/receipt`, `Receipting Log [${formattedDate}]`, ApiType.CaseApi, data.selectedIds, data.batchId);
    }
  }
}