import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {ContactFacade, FinancialPremiumsFacade, FinancialVendorFacade, GridFilterParam, PaymentPanel, PaymentType, PaymentsFacade } from '@cms/case-management/domain'; 
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { DocumentFacade, LoggingService } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-premiums-batch-items-page',
  templateUrl: './financial-premiums-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchItemsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  
   insurancePremium$ = this.financialPremiumsFacade.insurancePremium$;
   sortValue = this.financialPremiumsFacade.sortValueBatchItem;
   sortType = this.financialPremiumsFacade.sortType;
   pageSizes = this.financialPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialPremiumsFacade.skipCount;
   sort = this.financialPremiumsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPremiumsFacade.batchItemsData$;
   batchItemsLoader$ =  this.financialPremiumsFacade.batchItemsLoader$;
   paymentDetails$ =  this.paymentFacade.paymentDetails$;
   paymentPanelData$ = this.paymentFacade.paymentPanelData$;
   premiumType: any;
   vendorAddressId:any;
   batchId:any;
   vendorId:any;
   @ViewChild('providerDetailsTemplate', { read: TemplateRef })
   providerDetailsTemplate!: TemplateRef<any>;
   paymentRequestId: any;
   vendorProfile$ = this.financialVendorFacade.providePanelSubject$
   updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
   ddlStates$ = this.contactFacade.ddlStates$;
   paymentMethodCode$ = this.lovFacade.paymentMethodType$
   providerDetailsDialog:any;
   constructor(
     private readonly financialPremiumsFacade: FinancialPremiumsFacade,
     private readonly router: Router,   
     private readonly cdr: ChangeDetectorRef,
     private loggingService: LoggingService,
     private paymentFacade: PaymentsFacade,
     private readonly route: ActivatedRoute,
     public contactFacade: ContactFacade,
     public lovFacade: LovFacade,
     private dialogService: DialogService,
     private readonly financialVendorFacade : FinancialVendorFacade,
     private documentFacade : DocumentFacade
   ) {}

   ngOnInit(): void {
    this.premiumType =this.financialPremiumsFacade.getPremiumType(this.router)
     this.addNavigationSubscription();
     this.getQueryParams();
     this.loadPaymentDetails();
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
    this.vendorAddressId = this.route.snapshot.queryParams['eid'];
    this.batchId = this.route.snapshot.queryParams['bid'];
    this.vendorId = this.route.snapshot.queryParams['vid'];
    this.paymentRequestId = this.route.snapshot.queryParams['pid'];
  }

  loadBatchItemListGrid(event: any) { 
    const itemId = this.route.snapshot.queryParams['pid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadBatchItemsListGrid(this.batchId, itemId, this.premiumType, params);
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

  loadPaymentDetails(){
    const itemId = this.route.snapshot.queryParams['pid'];
    this.paymentFacade.loadPaymentDetails(itemId, PaymentType.Individual);
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
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
  }

  loadPremium(premiumId: any) {
    this.financialPremiumsFacade.loadPremium(this.premiumType, premiumId);
  }
  
  updatePremium(premium:any){
    this.financialPremiumsFacade.updatePremium(this.premiumType, premium.premiumId, premium);
  }
}
