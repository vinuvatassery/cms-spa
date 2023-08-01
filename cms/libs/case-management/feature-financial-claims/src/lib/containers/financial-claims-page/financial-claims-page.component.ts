import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade, ScreenType } from '@cms/case-management/domain';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-page',
  templateUrl: './financial-claims-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  claimsType: any;

  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;

  sortValueFinancialClaimsProcess =
    this.financialClaimsFacade.sortValueFinancialClaimsProcess;
  sortProcessList = this.financialClaimsFacade.sortProcessList;
  sortValueFinancialClaimsBatch =
    this.financialClaimsFacade.sortValueFinancialClaimsBatch;
  sortBatchList = this.financialClaimsFacade.sortBatchList;
  sortValueFinancialClaimsPayments =
    this.financialClaimsFacade.sortValueFinancialClaimsPayments;
  sortPaymentsList = this.financialClaimsFacade.sortPaymentsList;

  state!: State;
  financialClaimsProcessGridLists$ =
    this.financialClaimsFacade.financialClaimsProcessData$;
  financialClaimsBatchGridLists$ =
    this.financialClaimsFacade.financialClaimsBatchData$;

  financialClaimsAllPaymentsGridLists$ =
    this.financialClaimsFacade.financialClaimsAllPaymentsData$;

  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.claimsType = this.activatedRoute.snapshot.params['type'];
    this.addNavigationSubscription();
  }

  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe({
        next: () => {
          this.claimsType = this.activatedRoute.snapshot.params['type']; 
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          // this.loggingService.logException(err);
        },
      });
  }

  loadFinancialClaimsProcessListGrid(event: any) {
    this.financialClaimsFacade.loadFinancialClaimsProcessListGrid();
  }

  loadFinancialClaimsBatchListGrid(event: any) {
    this.financialClaimsFacade.loadFinancialClaimsBatchListGrid();
  }

  loadFinancialClaimsAllPaymentsListGrid(event: any) {
    this.financialClaimsFacade.loadFinancialClaimsAllPaymentsListGrid();
  }
}
