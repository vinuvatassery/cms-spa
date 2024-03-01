import { ChangeDetectionStrategy, OnInit, Component, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, PaymentPanel, PaymentsFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {  filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-claims-batch-items-page',
  templateUrl: './financial-claims-batch-items-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchItemsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialClaimsFacade.sortValueBatchItem;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortBatchItemList;
  state!: State;
  batchItemsGridLists$ = this.financialClaimsFacade.batchItemsData$;
  batchItemsLoader$ =  this.financialClaimsFacade.batchItemsLoader$;
  paymentDetails$ =  this.paymentFacade.paymentDetails$;
  claimsType: any;
  currentUrl:any
  paymentPanelData$ = this.paymentFacade.paymentPanelData$;
  vendorAddressId:any;
  batchId:any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
 exportButtonShow$ = this.documentFacade.exportButtonShow$;
 claimsServiceProfile$ = this.financialClaimsFacade.claimsServiceProfileSubject;
  providerDetailsDialog:any;
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router, 
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private paymentFacade:PaymentsFacade,
    private readonly route: ActivatedRoute,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private dialogService: DialogService,
    private documentFacade: DocumentFacade

  ) {}

  ngOnInit(): void {    
   this.claimsType = this.financialClaimsFacade.getClaimsType(this.router)
   this.addNavigationSubscription();
   this.getQueryParams();
   this.loadPaymentDetails();
  }

  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) 
      .subscribe({
        next: () => {
          this.claimsType = this.financialClaimsFacade.getClaimsType(this.router)
          this.cdr.detectChanges();
        },

        error: (err: any) => {
           this.loggingService.logException(err);
        },
      });
  }

  private getQueryParams() {
    this.vendorAddressId = this.route.snapshot.queryParams['eid'];
    this.batchId = this.route.snapshot.queryParams['bid'];
    this.paymentRequestId = this.route.snapshot.queryParams['pid'];
  }


  loadBatchItemListGrid(event: any) {
    const itemId = this.route.snapshot.queryParams['pid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialClaimsFacade.loadBatchItemsListGrid(itemId, params, this.claimsType);
  }

  
  exportBatchItemListGridData(data:any){
    const  filter = JSON.stringify(data?.Filter);
     const PagingAndSortedRequest =
     {
       SortType : data?.SortType,
       Sorting : data?.Sorting,
       SkipCount : data?.SkipCount,
       MaxResultCount : data?.MaxResultCount,
       Filter : filter
     }
     const itemId = this.route.snapshot.queryParams['pid'];
     const fileName = (this.claimsType[0].toUpperCase() + this.claimsType.substr(1).toLowerCase())  +' Claims batch items'
     this.documentFacade.getExportFile(PagingAndSortedRequest,`claims/${itemId}/services` , fileName)
   }

  loadPaymentPanel(event:any=null){
    this.paymentFacade.loadPaymentPanel(this.paymentRequestId,this.batchId);    
  }
  updatePaymentPanel(paymentPanel:PaymentPanel){
    this.paymentFacade.updatePaymentPanel(this.batchId, paymentPanel);
    this.paymentFacade.updatePaymentPanelResponse$.subscribe({
        next: (response: any) => {
          this.loadPaymentPanel();
        }
      });
  }

  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
  }

  updateProviderProfile(event:any){
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }

  loadPaymentDetails(){
    const itemId = this.route.snapshot.queryParams['pid'];
    this.paymentFacade.loadPaymentDetails(itemId, 'INDIVIDUAL',);
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
  
  }
