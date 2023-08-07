import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
import { Router, NavigationEnd } from '@angular/router';
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
  state!: State;
  reconcileGridLists$ = this.financialClaimsFacade.reconcileDataList$;
  reconcileBreakoutSummary$ = this.financialClaimsFacade.reconcileBreakoutSummary$;
  reconcilePaymentBreakoutList$ = this.financialClaimsFacade.reconcilePaymentBreakoutList$;

  claimsType: any;
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
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

  loadReconcileListGrid(event: any) {
    this.financialClaimsFacade.loadReconcileListGrid();
  }

  loadReconcileBreakoutSummary(event: any)
  {
    this.financialClaimsFacade.loadReconcilePaymentBreakoutSummary(event.batchId,event.entityId);
  }

  loadReconcilePaymentBreakoutList(event: any)
  {
    this.financialClaimsFacade.loadReconcilePaymentBreakoutListGrid(event.batchId,event.entityId,event.skipCount, event.pageSize, event.sort,event.sortType);
  }
}
