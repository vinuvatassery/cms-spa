import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-financial-claims-batch-page',
  templateUrl: './financial-claims-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialClaimsFacade.sortValueBatchLog;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortBatchLogList;
  state!: State;
  paymentsByBatchGridLists$ = this.financialClaimsFacade.paymentsByBatchData$;
  paymentByBatchGridLoader$ =  this.financialClaimsFacade.paymentByBatchGridLoader$;
  paymentBatchName$ =  this.financialClaimsFacade.paymentBatchName$;
  claimsType: any;
  batchId!:string;
  
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  letterContentList$ = this.financialClaimsFacade.letterContentList$;
  letterContentLoader$ = this.financialClaimsFacade.letterContentLoader$;
  providerDetailsDialog: any
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId: any;
  
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private readonly financialVendorFacade : FinancialVendorFacade

  ) {}

  ngOnInit(): void {
    this.batchId =   this.route.snapshot.queryParams['bid'];  
    this.claimsType = this.financialClaimsFacade.getClaimsType(this.router)
    this.addNavigationSubscription();
    this.loadBatchName();
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

  loadBatchLogListGrid(event: any) {
    const batchId = this.route.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialClaimsFacade.loadBatchLogListGrid(batchId, params, this.claimsType);
  }

  loadBatchName(){
    const batchId = this.route.snapshot.queryParams['bid'];
    this.financialClaimsFacade.loadBatchName(batchId);
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
    this.financialClaimsFacade.loadEachLetterTemplate(this.claimsType, event);  
  }
}
