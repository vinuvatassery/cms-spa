import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {ContactFacade, FinancialPremiumsFacade, FinancialVendorFacade } from '@cms/case-management/domain'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

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

   premiumType: any;
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
     public contactFacade: ContactFacade,
     public lovFacade: LovFacade,
     private dialogService: DialogService,
     private readonly financialVendorFacade : FinancialVendorFacade
   ) {}
   ngOnInit(): void {
    this.premiumType =this.financialPremiumsFacade.getPremiumType(this.router)
     this.addNavigationSubscription();
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
    this.financialPremiumsFacade.loadBatchItemsListGrid();
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

}
