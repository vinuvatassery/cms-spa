import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumTypeCode, FinancialPremiumsFacade } from '@cms/case-management/domain';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-premiums-batch-page',
  templateUrl: './financial-premiums-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPageComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPremiumsFacade.sortValueBatchLog;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialPremiumsFacade.batchLogData$;

  
  premiumType: any;
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
  ) {}
  ngOnInit(): void {
    this.premiumType =this.router.url.split('/')?.filter(element => element === FinancialPremiumTypeCode.Dental || element ===FinancialPremiumTypeCode.Medical)[0]
    this.addNavigationSubscription();
  }
  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.premiumType =this.router.url.split('/')?.filter(element => element === FinancialPremiumTypeCode.Dental || element ===FinancialPremiumTypeCode.Medical)[0]
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  loadBatchLogListGrid(event: any) {
    this.financialPremiumsFacade.loadBatchLogListGrid();
  }
}
