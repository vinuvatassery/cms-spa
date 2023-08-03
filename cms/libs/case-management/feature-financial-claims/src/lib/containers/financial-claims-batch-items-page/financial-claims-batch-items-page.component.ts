import { ChangeDetectionStrategy, OnInit, Component, ChangeDetectorRef, Input } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, PaymentsFacade } from '@cms/case-management/domain';
import { Router, NavigationEnd } from '@angular/router';
import {  filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

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
  @Input() vendorId:any='8CD495BE-3296-43B3-A9C4-EF7829D2D026'
  @Input() batchId:any ='652C706E-5FD4-4C50-8AC3-0FA806949E86'

  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router, 
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private paymentFacade:PaymentsFacade
  ) {}

  ngOnInit(): void {    
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
  loadBatchItemListGrid(event: any) {
    this.financialClaimsFacade.loadBatchItemsListGrid();
  }
  loadPaymentPanel(event:any=null){
    this.paymentFacade.loadPaymentPanel(this.vendorId,this.batchId);    
  }
}
