import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalPremiumsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-dental-premiums-batch-page',
  templateUrl: './dental-premiums-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialDentalPremiumsFacade.sortValueBatchLog;
  sortType = this.financialDentalPremiumsFacade.sortType;
  pageSizes = this.financialDentalPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialDentalPremiumsFacade.skipCount;
  sort = this.financialDentalPremiumsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialDentalPremiumsFacade.batchLogData$;
  constructor(
    private readonly financialDentalPremiumsFacade: FinancialDentalPremiumsFacade
  ) {}

  loadBatchLogListGrid(event: any) {
    this.financialDentalPremiumsFacade.loadBatchLogListGrid();
  }
}
