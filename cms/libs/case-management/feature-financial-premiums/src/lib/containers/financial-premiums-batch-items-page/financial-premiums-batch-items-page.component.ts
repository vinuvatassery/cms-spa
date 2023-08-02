import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade } from '@cms/case-management/domain'; 
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

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
   constructor(
     private readonly financialPremiumsFacade: FinancialPremiumsFacade,
     private readonly router: Router,
     private readonly activatedRoute: ActivatedRoute,
     private readonly cdr: ChangeDetectorRef
   ) {}
   ngOnInit(): void {
     this.premiumType = this.activatedRoute.snapshot.params['type'];
     this.addNavigationSubscription();
   }
   private addNavigationSubscription() {
     this.router.events
       .pipe(filter((event) => event instanceof NavigationEnd))
       .subscribe({
         next: () => {
           this.premiumType = this.activatedRoute.snapshot.params['type'];
           this.cdr.detectChanges();
         },
 
         error: (err: any) => {
           // this.loggingService.logException(err);
         },
       });
   }

  loadBatchItemListGrid(event: any) { 
    this.financialPremiumsFacade.loadBatchItemsListGrid();
  }
}
