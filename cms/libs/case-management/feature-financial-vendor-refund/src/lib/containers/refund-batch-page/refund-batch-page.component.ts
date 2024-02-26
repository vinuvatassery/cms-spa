import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, FinancialVendorRefundFacade, PaymentsFacade } from '@cms/case-management/domain';
import { DocumentFacade } from 'libs/shared/util-core/src/lib/application/document-facade';
import { ActivatedRoute } from '@angular/router';
import { ApiType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

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
  vendorRefundBatchClaims$ = this.financialVendorRefundFacade.vendorRefundBatchClaimsSubject;
  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private documentFacade: DocumentFacade,
    private readonly route: ActivatedRoute,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private paymentFacade: PaymentsFacade,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private dialogService: DialogService,
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

  dataExportParameters: any;
  exportReceiptDataEvent(data: any) {
    const gridDataResult = data.gridDataResult;
    if (data) {
      const filter = JSON.stringify(gridDataResult?.filter);

      const exportGridParams = {
        SortType: this.sortType,
        Sorting: this.sortValue,
        SkipCount: gridDataResult?.skipcount,
        MaxResultCount: gridDataResult?.maxResultCount,
        Filter: filter,
      };
      this.dataExportParameters = exportGridParams;
      const formattedDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.');
      this.documentFacade.getExportFileForSelection(this.dataExportParameters, `vendor-refunds/batches/receipt`, `Receipting Log [${formattedDate}]`, data, data.batchId, ApiType.CaseApi);
    }
  }

  updateProviderProfile(event: any) {
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick() {
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  //provider panel
  @ViewChild('premiumProviderDetailsTemplate', { read: TemplateRef })
  premiumProviderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('tpaProviderDetailsTemplate', { read: TemplateRef })
  tpaProviderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('pharmacyProviderDetailsTemplate', { read: TemplateRef })
  pharmacyProviderDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  providerDetailsDialog: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;

  //provider panel

  onProviderNameClick(event: any) {
    if (event.type == 'TPA') {
      this.processProviderPanel(event, this.tpaProviderDetailsTemplate)
    }
    if (event.type == 'INSURANCE_PREMIUM') {
      this.processProviderPanel(event, this.premiumProviderDetailsTemplate)
    }
    if (event.type == 'PHARMACY') {
      this.processProviderPanel(event, this.pharmacyProviderDetailsTemplate)
    }
  }

  processProviderPanel(event: any, templateType: any){
    this.paymentRequestId = event.paymentRequestId
    this.providerDetailsDialog = this.dialogService.open({
      content: templateType,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }
  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event);
  }
}
