import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {ContactFacade, FinancialPremiumsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-premiums-batch-page',
  templateUrl: './financial-premiums-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPremiumsFacade.sortValueBatchLog;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortBatchLogList;
  exportButtonShow$ = this.documentFacade.exportButtonShow$
  state!: State;
  batchLogGridLists$ = this.financialPremiumsFacade.batchLogData$;
  batchLogServicesData$ = this.financialPremiumsFacade.batchLogServicesData$;
  unbatchPremiums$ = this.financialPremiumsFacade.unbatchPremiums$;
  unbatchEntireBatch$ = this.financialPremiumsFacade.unbatchEntireBatch$;
  actionResponse$ = this.financialPremiumsFacade.premiumActionResponse$;
  paymentBatchName$= this.financialPremiumsFacade.paymentBatchName$;
  letterContentList$ = this.financialPremiumsFacade.letterContentList$;
  letterContentLoader$ = this.financialPremiumsFacade.letterContentLoader$;
  batchId!:string;
  dataExportParameters! : any
  premiumType: any;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  paymentByBatchGridLoader$ = this.financialPremiumsFacade.paymentByBatchGridLoader$;
  insurancePremium$ = this.financialPremiumsFacade.insurancePremium$;
  providerDetailsDialog:any;
  insuranceCoverageDates$ = this.financialPremiumsFacade.insuranceCoverageDates$;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private documentFacade :  DocumentFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade : FinancialVendorFacade
  ) {}
  ngOnInit(): void {
    this.batchId =   this.activatedRoute.snapshot.queryParams['bid'];
    this.premiumType = this.financialPremiumsFacade.getPremiumType(this.router)
    this.addNavigationSubscription();
    this.loadBatchName();
  }
  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.premiumType =this.financialPremiumsFacade.getPremiumType(this.router)
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  loadBatchName(){
    const batchId = this.activatedRoute.snapshot.queryParams['bid'];
    this.financialPremiumsFacade.loadBatchName(batchId);
  }

  loadBatchLogListGrid(event: any) {
    this.dataExportParameters = event
    const batchId = this.activatedRoute.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadBatchLogListGrid(event.isReconciled, this.premiumType, batchId, params);
  }



  loadFinancialPremiumBatchInvoiceList(event: any) {
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadPremiumServicesByPayment(this.premiumType, event.paymentRequestId, params);
  }

  exportPremiumBatchesGridData(){

    const data = this.dataExportParameters;
    if(data){
    const  filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest =
      {
        SortType : data?.sortType,
        Sorting : data?.sortColumn,
        SkipCount : data?.skipcount,
        MaxResultCount : data?.maxResultCount,
        Filter : filter
      }
      const batchId = this.activatedRoute.snapshot.queryParams['bid'];
      const fileName = (this.premiumType[0].toUpperCase() + this.premiumType.substr(1).toLowerCase())  +' Premium Batch Payments'

      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`premium/${this.premiumType}/payment-batches/${batchId}/payments?isReconciled=${data.isReconciled}` , fileName)
    }
  }

  unBatchEntireBatchClick(event:any){
   this.financialPremiumsFacade.unbatchEntireBatch(event.batchId,event.premiumsType)
  }
  unBatchPremiumClick(event:any){
    this.financialPremiumsFacade.unbatchPremiums(event.paymentId,event.premiumsType)
  }
  deletePayment(paymentId: string){
    this.financialPremiumsFacade.deletePremiumPayment(this.premiumType, paymentId);
  }

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

  loadEachLetterTemplate(event:any){
    this.financialPremiumsFacade.loadEachLetterTemplate(this.premiumType, event);  
  }

  updatePremium(premium:any){
    this.financialPremiumsFacade.updatePremium(this.premiumType, premium.premiumId, premium);
  }

  loadPremiumEvent(premiumId: string){
    this.financialPremiumsFacade.loadPremium(this.premiumType, premiumId);
  }

}
