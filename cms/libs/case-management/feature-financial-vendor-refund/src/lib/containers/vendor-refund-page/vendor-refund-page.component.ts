/** Angular **/
import {  Component, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, PaymentsFacade } from '@cms/case-management/domain';
import { ApiType, DocumentFacade } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
})
export class VendorRefundPageComponent
{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  tab = this.financialVendorRefundFacade.selectedRefundsTab;
  dataExportParameters :any;
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
  paymentDetails$ =  this.paymentFacade.paymentDetails$;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
  vendorRefundListProfilePhoto$ = this.financialVendorRefundFacade.vendorRefundListProfilePhotoSubject;
  allRefundProfilePhoto$ = this.financialVendorRefundFacade.allRefundProfilePhotoSubject;

  //provider panel
  @ViewChild('premiumProviderDetailsTemplate', { read: TemplateRef })
  premiumProviderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('tpaProviderDetailsTemplate', { read: TemplateRef })
  tpaProviderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('pharmacyProviderDetailsTemplate', { read: TemplateRef })
  pharmacyProviderDetailsTemplate!: TemplateRef<any>;
  providerDetailsDialog: any
  paymentRequestId: any;

  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade ,
    private documentFacade: DocumentFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private paymentFacade:PaymentsFacade,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private dialogService: DialogService,
  ) {}

  pageTitle = "Vendor Refunds";
  changeTitle(data: any): void
  {
    this.pageTitle = data ?? "Vendor Refunds";
  }

  loadVendorRefundProcessListGrid(event: any) {

    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }

  loadVendorRefundBatchListGrid(loadBatchListRequestDto : any) {
    this.financialVendorRefundFacade.selectedRefundsTab = 2;
    this.tab = this.financialVendorRefundFacade.selectedRefundsTab;
    this.batchesGridExportParameters = loadBatchListRequestDto;
    this.financialVendorRefundFacade.loadVendorRefundBatchListGrid(loadBatchListRequestDto);
  }

  loadVendorRefundAllPaymentsListGrid(recentClaimsPageAndSortedRequestDto : any) {
    this.financialVendorRefundFacade.selectedRefundsTab = 3;
    this.tab = this.financialVendorRefundFacade.selectedRefundsTab;
    this.dataExportParameters = recentClaimsPageAndSortedRequestDto;
    this.financialVendorRefundFacade.loadVendorRefundAllPaymentsListGrid(recentClaimsPageAndSortedRequestDto);
  }

  loadFinancialRefundProcessListGrid(data: any) {
    this.financialVendorRefundFacade.selectedRefundsTab = 1;
    this.tab = this.financialVendorRefundFacade.selectedRefundsTab;
    this.dataExportParameters = data;
    this.financialVendorRefundFacade.loadFinancialRefundProcessListGrid(
      data?.skipCount,
      data?.pagesize,
      data?.sortColumn,
      data?.sortType,
      data?.filter,

    );
  }

  exportAllRefundsGridData()
  {
    if (this.dataExportParameters) {
      this.documentFacade.getExportFile(this.dataExportParameters, `vendor-refunds/payments`,'All Refunds');
    }
  }

  exportRefundsGridProcessData()
  {
    const RefundPageAndSortedRequestDto =
    {
       sortType : this.dataExportParameters?.sortType as string,
      sorting : this.dataExportParameters?.sortColumn,
      skipCount : this.dataExportParameters?.skipCount,
      maxResultCount : this.dataExportParameters?.pagesize,
      Filter : JSON.stringify (this.dataExportParameters?.filter)
    }
      this.documentFacade.getExportFile(RefundPageAndSortedRequestDto, `vendor-refunds`,'Vendor Refunds');
  }
  exportBatchesGridData()
  {
    if (this.batchesGridExportParameters) {
      this.documentFacade.getExportFile(this.batchesGridExportParameters, `vendor-refunds/batches`,'All Batches');
    }
  }

  exportReceiptDataEvent(data: any) {
    if (this.dataExportParameters) {
      const formattedDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.');
      this.documentFacade.getExportFileForSelection(this.dataExportParameters, `vendor-refunds/receipt`, `Receipting Log [${formattedDate}]`, data, null, ApiType.CaseApi);
    }
  }

//provider panel

  onProviderNameClick(event:any){
    if(event.type == 'TPA'){
      this.onTpaProviderNameClick(event)
    }
    if(event.type == 'INSURANCE_PREMIUM'){
      this.onPremiumProviderNameClick(event)

    }
    if(event.type == 'PHARMACY'){
      this.onPharmacyProviderNameClick(event)

    }
  }
  onTpaProviderNameClick(event:any){
    this.paymentRequestId = event.paymentRequestId
    this.providerDetailsDialog = this.dialogService.open({
      content: this.tpaProviderDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  onPremiumProviderNameClick(event:any){
    this.paymentRequestId = event.paymentRequestId
    this.providerDetailsDialog = this.dialogService.open({
      content: this.premiumProviderDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  onPharmacyProviderNameClick(event:any){
    this.paymentRequestId = event.paymentRequestId
    this.providerDetailsDialog = this.dialogService.open({
      content: this.pharmacyProviderDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }

  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
  }

  updateProviderProfile(event:any){
    console.log(event)
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }

}
