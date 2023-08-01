import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalClaimsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-dental-claims-batch-page',
  templateUrl: './dental-claims-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialDentalClaimsFacade.sortValueBatchLog;
  sortType = this.financialDentalClaimsFacade.sortType;
  pageSizes = this.financialDentalClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialDentalClaimsFacade.skipCount;
  sort = this.financialDentalClaimsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialDentalClaimsFacade.batchLogData$;
  constructor(
    private readonly financialDentalClaimsFacade: FinancialDentalClaimsFacade
  ) {}

  loadBatchLogListGrid(event: any) {
    this.financialDentalClaimsFacade.loadBatchLogListGrid();
  }
}
