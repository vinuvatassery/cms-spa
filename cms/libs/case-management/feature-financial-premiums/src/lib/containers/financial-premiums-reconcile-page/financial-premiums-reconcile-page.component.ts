import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {ContactFacade, FinancialPremiumsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain'; 
import { Router,  NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-premiums-reconcile-page',
  templateUrl: './financial-premiums-reconcile-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsReconcilePageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPremiumsFacade.sortValueReconcilePaymentBreakout;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortReconcilePaymentBreakoutList;
  sortValueBatch = this.financialPremiumsFacade.sortValueReconcile;
  sortBatch = this.financialPremiumsFacade.sortReconcileList;
  state!: State;
  reconcileGridLists$ = this.financialPremiumsFacade.reconcileDataList$;
  reconcileBreakoutSummary$ = this.financialPremiumsFacade.reconcileBreakoutSummary$;
  reconcileBreakoutList$ = this.financialPremiumsFacade.reconcileBreakoutList$;
  warrantNumberChange$ = this.financialPremiumsFacade.warrantNumberChange$;
  warrantNumberChangeLoader$ = this.financialPremiumsFacade.warrantNumberChangeLoader$;
  letterContentList$ = this.financialPremiumsFacade.letterContentList$;
  letterContentLoader$ = this.financialPremiumsFacade.letterContentLoader$;
  batchId:any;
  premiumType: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  providerDetailsDialog: any
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  dataExportParameters! : any
  exportButtonShow$ = this.documentFacade.exportButtonShow$

  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly route: ActivatedRoute,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private documentFacade :  DocumentFacade
    
  ) {}
  ngOnInit(): void {
    this.premiumType =this.financialPremiumsFacade.getPremiumType(this.router);
    this.addNavigationSubscription();
    this.getQueryParams();
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

  private getQueryParams() {
    this.batchId = this.route.snapshot.queryParams['bid'];  
  }

  loadReconcileListGrid(event: any) { 
    this.dataExportParameters = event;
    const params = new GridFilterParam(event.skipCount, event.pageSize, event.sortColumn, event.sortType, JSON.stringify(event.filter)); 
    this.financialPremiumsFacade.loadReconcileListGrid(this.batchId,this.premiumType,params);    
  }

  loadReconcileBreakoutSummary(event: any)
  {
    event.premiumsType=this.premiumType;
    this.financialPremiumsFacade.loadInsurancePremiumBreakoutSummary(event);
  }

  loadReconcilePaymentBreakoutList(event: any)
  {
    event.premiumsType=this.premiumType;
    this.financialPremiumsFacade.loadInsurancePremiumBreakoutList(event);
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

  exportPremiumBatchesGridData(){
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
      const fileName = (this.premiumType[0].toUpperCase() + this.premiumType.substr(1).toLowerCase())  +' Premium Reconciling Payment'
      this.documentFacade.getExportFile(vendorPageAndSortedRequest,`premium/${this.premiumType}/payment-batches/${this.batchId}/reconcile-payments` , fileName)
    }
  }

  warrantNumberChange(data:any){
    this.financialPremiumsFacade.checkWarrantNumber(data.batchId, data.checkNbr, data.vendorId,this.premiumType);   
  }

  loadEachLetterTemplate(event:any){
    this.financialPremiumsFacade.loadEachLetterTemplate(this.premiumType, event);  
  }
}
