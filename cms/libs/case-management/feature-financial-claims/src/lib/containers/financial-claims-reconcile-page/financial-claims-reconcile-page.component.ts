import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { filter } from 'rxjs';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-claims-reconcile-page',
  templateUrl: './financial-claims-reconcile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsReconcilePageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialClaimsFacade.sortValueReconcilePaymentBreakout;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortReconcilePaymentBreakoutList;
  sortValueBatch = this.financialClaimsFacade.sortValueReconcile;
  sortBatch = this.financialClaimsFacade.sortReconcileList;
  state!: State;
  reconcileGridLists$ = this.financialClaimsFacade.reconcileDataList$;
  reconcileBreakoutSummary$ = this.financialClaimsFacade.reconcileBreakoutSummary$;
  reconcilePaymentBreakoutList$ = this.financialClaimsFacade.reconcilePaymentBreakoutList$;
  warrantNumberChange$ = this.financialClaimsFacade.warrantNumberChange$;
  warrantNumberChangeLoader$ = this.financialClaimsFacade.warrantNumberChangeLoader$;
  letterContentList$ = this.financialClaimsFacade.letterContentList$;
  letterContentLoader$ = this.financialClaimsFacade.letterContentLoader$;
  batchId:any;
  claimsType: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  providerDetailsDialog: any
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId!:any;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  dataExportParameters! : any
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly route: ActivatedRoute,
    private readonly financialVendorFacade : FinancialVendorFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private documentFacade :  DocumentFacade
  ) {}

  ngOnInit(): void { 
    this.getQueryParams();
    this.claimsType = this.financialClaimsFacade.getClaimsType(this.router)
    this.addNavigationSubscription();    
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
    this.batchId = this.route.snapshot.queryParams['bid'];  
  }

  loadReconcileListGrid(event: any) {   
    this.dataExportParameters = event;
    const params = new GridFilterParam(event.skipCount, event.pageSize, event.sortColumn, event.sortType, JSON.stringify(event.filter));    
    this.financialClaimsFacade.loadReconcileListGrid(this.batchId,this.claimsType,params);    
  }

  loadReconcileBreakoutSummary(event: any)
  {
    event.claimsType=this.claimsType;
    this.financialClaimsFacade.loadReconcilePaymentBreakoutSummary(event);
  }

  loadReconcilePaymentBreakoutList(event: any)
  {
    
    event.claimsType=this.claimsType;
    this.financialClaimsFacade.loadReconcilePaymentBreakoutListGrid(event);
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
  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }
  navigateProviderPanel(paymentRequestId:any){
    this.paymentRequestId=paymentRequestId;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',  
      }, 
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
    
  }
  exportClaimBatchesGridData(){
    const data = this.dataExportParameters
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
      const fileName = (this.claimsType[0].toUpperCase() + this.claimsType.substr(1).toLowerCase())  +' Claims Reconciling Payment'
      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`claims/${this.claimsType}/payment-batches/${this.batchId}/reconcile-payments` , fileName)
    }
  }
  warrantNumberChange(data:any){
    this.financialClaimsFacade.CheckWarrantNumber(data.batchId,data.checkNbr,data.vendorId,this.claimsType);   
  }
  loadEachLetterTemplate(event:any){
    this.financialClaimsFacade.loadEachLetterTemplate(this.claimsType, event);  
  }
  
}
