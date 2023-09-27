import {
  ChangeDetectionStrategy,
  OnInit,
  Component,
  ChangeDetectorRef,
} from '@angular/core';
import { FinancialPremiumsFacade,GridFilterParam, InsurancePremium, PolicyPremiumCoverage } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-premiums-page',
  templateUrl: './financial-premiums-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPageComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  state!: State;
  filter!: any;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sortValueFinancialPremiumsProcess =
    this.financialPremiumsFacade.sortValueFinancialPremiumsProcess;
  sortProcessList = this.financialPremiumsFacade.sortProcessList;
  sortValueFinancialPremiumsBatch =
    this.financialPremiumsFacade.sortValueFinancialPremiumsBatch;
  sortBatchList = this.financialPremiumsFacade.sortBatchList;
  sortValueFinancialPremiumsPayments =
    this.financialPremiumsFacade.sortValueFinancialPremiumsPayments;
  sortPaymentsList = this.financialPremiumsFacade.sortPaymentsList;
  financialPremiumsProcessGridLists$ =
    this.financialPremiumsFacade.financialPremiumsProcessData$;
  financialPremiumsBatchGridLists$ =
    this.financialPremiumsFacade.financialPremiumsBatchData$;
  financialPremiumsAllPaymentsGridLists$ =
    this.financialPremiumsFacade.financialPremiumsAllPaymentsData$;
    public sortValue = this.financialPremiumsFacade.clientsSortValue;
  insurancePlans$ = this.financialPremiumsFacade.insurancePlans$;
  insurancePlansLoader$ = this.financialPremiumsFacade.insurancePlansLoader$;
  insuranceCoverageDates$ = this.financialPremiumsFacade.insuranceCoverageDates$;
  insuranceCoverageDatesLoader$ = this.financialPremiumsFacade.insuranceCoverageDatesLoader$;
  actionResponse$ = this.financialPremiumsFacade.premiumActionResponse$;
  existingPremiums$ = this.financialPremiumsFacade.existingCoverageDates$;
  premiumType: any;
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private loggingService: LoggingService,
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => this.premiumType = data['type'])
    this.addNavigationSubscription();
  }
  private addNavigationSubscription() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.activatedRoute.params.subscribe(data => this.premiumType = data['type'])
          this.cdr.detectChanges();
        },

        error: (err: any) => {
          this.loggingService.logException(err);
        },
      });
  }
  loadFinancialPremiumsProcessListGrid(event: any) : void{
    const param = new GridFilterParam(
      event?.skipCount ?? 0,
      event?.pagesize ?? 0,
      event?.sortColumn,
      event?.sortType,
      event.filter);
    this.pageSizes = this.financialPremiumsFacade.gridPageSizes;
    this.financialPremiumsFacade.loadMedicalPremiumList(param);
  }

  loadFinancialPremiumsBatchListGrid(event: any) {
    this.financialPremiumsFacade.loadFinancialPremiumsBatchListGrid();
  }

  loadFinancialPremiumsAllPaymentsListGrid(event: any) {
    this.financialPremiumsFacade.loadFinancialPremiumsAllPaymentsListGrid();
  }

  loadInsurancePlans(clientId: number) {
    this.financialPremiumsFacade.loadInsurancePlans(clientId);
  }

  loadInsurancePlansCoverageDates(clientId: number) {
    this.financialPremiumsFacade.loadInsurancePlansCoverageDates(clientId);
  }

  premiumExistValidation(data: { clientId: number, premiums: PolicyPremiumCoverage[] }){
    this.financialPremiumsFacade.getExistingPremiums(data.clientId, this.premiumType, data.premiums);
  }

  saveInsurancePremiums(premiums: InsurancePremium[]) {
    this.financialPremiumsFacade.savePremiums(this.premiumType, premiums);
  }
}
