/** Angular **/
import {  Component, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialVendorFacade, FinancialVendorRefundFacade, PaymentsFacade } from '@cms/case-management/domain'; 
import { DocumentFacade } from 'libs/shared/util-core/src/lib/application/document-facade';
import { ApiType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html', 
})
export class VendorRefundPageComponent    
{
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
  paymentDetails$ =  this.paymentFacade.paymentDetails$;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  vendorRefundAllPaymentsGridLists$ = this.financialVendorRefundFacade.vendorRefundAllPaymentsData$;
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
  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
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

  exportAllRefundsGridData() 
  {   
    if (this.dataExportParameters) {       
      this.documentFacade.getExportFile(this.dataExportParameters, `vendor-refunds/payments`,'All Refunds');
    }
  }

  exportBatchesGridData()
  {
    if (this.batchesGridExportParameters) {       
      this.documentFacade.getExportFile(this.batchesGridExportParameters, `vendor-refunds/batches`,'All Batches');
    }
  }

  exportReceiptDataEvent(data: any) 
  {
    if (this.dataExportParameters) {
      const formattedDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.');
      this.documentFacade.getExportFileForSelection(this.dataExportParameters, `vendor-refunds/receipt`, `Receipting Log [${formattedDate}]`, ApiType.CaseApi, data);
    }
  }

  updateProviderProfile(event:any){
    this.financialVendorFacade.updateProviderPanel(event)
  }
  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  providerDetailsDialog:any;
  onProviderNameClick(event:any){
    this.paymentRequestId = event
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
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
}
