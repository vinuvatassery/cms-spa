import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {FinancialPremiumsFacade, FinancialVendorFacade, GridFilterParam, PaymentsFacade } from '@cms/case-management/domain'; 
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-premiums-batch-items-page',
  templateUrl: './financial-premiums-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchItemsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPremiumsFacade.sortValueBatchItem;
   sortType = this.financialPremiumsFacade.sortType;
   pageSizes = this.financialPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialPremiumsFacade.skipCount;
   sort = this.financialPremiumsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPremiumsFacade.batchItemsData$;
   paymentDetails$ =  this.paymentFacade.paymentDetails$;
   paymentData$ = this.paymentFacade.paymentPanelData$;
   premiumType: any;
   vendorAddressId:any;
   batchId:any;
   constructor(
     private readonly financialPremiumsFacade: FinancialPremiumsFacade,
     private readonly router: Router,   
     private readonly cdr: ChangeDetectorRef,
     private loggingService: LoggingService,
     private paymentFacade: PaymentsFacade,
     private readonly route: ActivatedRoute,
     private readonly financialVendorFacade: FinancialVendorFacade
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

  loadBatchItemListGrid(event: any) { 
    const itemId = this.route.snapshot.queryParams['pid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPremiumsFacade.loadBatchItemsListGrid();
  }

  loadPaymentPanel(event:any=null){
    this.paymentFacade.loadPaymentPanel(this.vendorAddressId,this.batchId);    
  }

  loadPaymentDetails(){
    const itemId = this.route.snapshot.queryParams['pid'];
    this.paymentFacade.loadPaymentDetails(itemId, 'INDIVIDUAL',);
  }

  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanel(event)
  }

  updateProviderProfile(event:any){
    this.financialVendorFacade.updateProviderPanel(event)
  }

  private getQueryParams() {
    this.vendorAddressId = this.route.snapshot.queryParams['eid'];
    this.batchId = this.route.snapshot.queryParams['bid'];
  }
}
