import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-claims-batch-page',
  templateUrl: './financial-claims-batch-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialClaimsFacade.sortValueBatchLog;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialClaimsFacade.batchLogData$;
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

  loadBatchLogListGrid(event: any) {
    this.financialClaimsFacade.loadBatchLogListGrid();
  }
}
