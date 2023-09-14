import {  ChangeDetectionStrategy,  ChangeDetectorRef,  Component, OnInit, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {FinancialPremiumsFacade } from '@cms/case-management/domain'; 
import { Router,  NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

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
  premiumType: any;
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
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

  loadReconcileListGrid(event: any) { 
    this.financialPremiumsFacade.loadReconcileListGrid();
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
}
