import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {  filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';
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
  sortValueFinancialInvoices = this.financialClaimsFacade.sortValueFinancialInvoiceProcess
  state!: State;
  financialClaimsProcessGridLists$ =
    this.financialClaimsFacade.financialClaimsProcessData$;
  financialClaimsBatchGridLists$ =
    this.financialClaimsFacade.financialClaimsBatchData$;

  financialClaimsAllPaymentsGridLists$ =
    this.financialClaimsFacade.financialClaimsAllPaymentsData$;

    financialClaimsInvoice$ = this.financialClaimsFacade.financialClaimsInvoice$;
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => this.claimsType = data['type'])
    this.addNavigationSubscription();
  }

  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))

      .subscribe({
        next: () => {
          this.activatedRoute.params.subscribe(data => this.claimsType = data['type'])
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }

  loadFinancialClaimsProcessListGrid(data: any) {
    this.financialClaimsFacade.loadFinancialClaimsProcessListGrid(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType,data?.filter,this.claimsType);
  }

  loadFinancialClaimsInvoiceListService(data: any)
  {
  this.financialClaimsFacade.loadFinancialClaimsInvoiceListService(data?.paymentRequestId , data?.skipcount,   data?.pagesize, data?.sortColumn, data?.sortType,this.claimsType)
  }

  loadFinancialClaimsBatchListGrid(data: any) {

    this.financialClaimsFacade.loadFinancialClaimsBatchListGrid( data?.skipCount,   data?.pagesize, data?.sortColumn, data?.sortType,data?.filter,this.claimsType);
  }

  loadFinancialClaimsAllPaymentsListGrid(data: any) {
    this.financialClaimsFacade.loadFinancialClaimsAllPaymentsListGrid(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType, data?.filter, this.claimsType);
  }
}
