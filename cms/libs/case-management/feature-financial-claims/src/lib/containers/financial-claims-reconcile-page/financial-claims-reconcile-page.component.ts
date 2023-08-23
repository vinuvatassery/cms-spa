import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { filter } from 'rxjs';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { LoggingService } from '@cms/shared/util-core';

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
  batchId:any;
  claimsType: any;
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly route: ActivatedRoute,
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
}
