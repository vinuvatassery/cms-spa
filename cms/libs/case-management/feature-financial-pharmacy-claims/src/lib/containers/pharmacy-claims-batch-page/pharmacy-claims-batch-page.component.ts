import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade, GridFilterParam } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cms-pharmacy-claims-batch-page',
  templateUrl: './pharmacy-claims-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPharmacyClaimsFacade.sortValueBatchLog;
  sortType = this.financialPharmacyClaimsFacade.sortType;
  pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  sort = this.financialPharmacyClaimsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialPharmacyClaimsFacade.batchLogData$;
  paymentByBatchGridLoader$ =  this.financialPharmacyClaimsFacade.paymentByBatchGridLoader$;
  claimsType= 'pharmacies';
  batchId!:string;
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly route: ActivatedRoute,
  ) {}

  loadBatchLogListGrid(event: any) {
    const batchId = this.route.snapshot.queryParams['bid'];
    const params = new GridFilterParam(event.skipCount, event.pagesize, event.sortColumn, event.sortType, JSON.stringify(event.filter));
    this.financialPharmacyClaimsFacade.loadBatchLogListGrid(batchId, params, this.claimsType);
  }
}
