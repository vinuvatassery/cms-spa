import { ChangeDetectionStrategy, OnInit, Component, ChangeDetectorRef, Input } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, PaymentPanel, PaymentsFacade } from '@cms/case-management/domain';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {  filter } from 'rxjs';
import { LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';

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
  claimsType: any;
  currentUrl:any
  paymentPanelData$ = this.paymentFacade.paymentPanelData$;
  @Input() vendorId:any;
  @Input() batchId:any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router, 
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private paymentFacade:PaymentsFacade,
    private readonly route: ActivatedRoute,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
    private readonly financialVendorFacade : FinancialVendorFacade
  ) {}

  ngOnInit(): void {    
   this.claimsType = this.financialClaimsFacade.getClaimsType(this.router)
   this.addNavigationSubscription();
   this.getQueryParams()
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
    this.vendorId = this.route.snapshot.params['vendorId'];
    this.batchId = this.route.snapshot.params['batchId'];
  }

  loadBatchItemListGrid(event: any) {
    this.financialClaimsFacade.loadBatchItemsListGrid();
  }
  loadPaymentPanel(event:any=null){
    this.paymentFacade.loadPaymentPanel(this.vendorId,this.batchId);    
  }
  updatePaymentPanel(paymentPanel:PaymentPanel){
    this.paymentFacade.showLoader();
    this.paymentFacade.updatePaymentPanel(this.vendorId,this.batchId, paymentPanel).subscribe({
        next: (response: any) => {        
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.paymentFacade.hideLoader();  
          this.loadPaymentPanel();    
          
        },
        error: (err) => {       
          this.paymentFacade.hideLoader();
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
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
