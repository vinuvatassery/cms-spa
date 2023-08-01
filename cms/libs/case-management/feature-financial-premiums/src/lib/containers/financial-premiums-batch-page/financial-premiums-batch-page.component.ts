import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-premiums-batch-page',
  templateUrl: './financial-premiums-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialPremiumsFacade.sortValueBatchLog;
  sortType = this.financialPremiumsFacade.sortType;
  pageSizes = this.financialPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialPremiumsFacade.skipCount;
  sort = this.financialPremiumsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialPremiumsFacade.batchLogData$;
  constructor(
    private readonly financialPremiumsFacade: FinancialPremiumsFacade
  ) {}

  loadBatchLogListGrid(event: any) {
    this.financialPremiumsFacade.loadBatchLogListGrid();
  }
}
