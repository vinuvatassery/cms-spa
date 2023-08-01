import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalPremiumsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-medical-premiums-batch-page',
  templateUrl: './medical-premiums-batch-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsBatchPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  sortValue = this.financialMedicalPremiumsFacade.sortValueBatchLog;
  sortType = this.financialMedicalPremiumsFacade.sortType;
  pageSizes = this.financialMedicalPremiumsFacade.gridPageSizes;
  gridSkipCount = this.financialMedicalPremiumsFacade.skipCount;
  sort = this.financialMedicalPremiumsFacade.sortBatchLogList;
  state!: State;
  batchLogGridLists$ = this.financialMedicalPremiumsFacade.batchLogData$;
  constructor(
    private readonly financialMedicalPremiumsFacade: FinancialMedicalPremiumsFacade
  ) {}

  loadBatchLogListGrid(event: any) {
    this.financialMedicalPremiumsFacade.loadBatchLogListGrid();
  }
}
