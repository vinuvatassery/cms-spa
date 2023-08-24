import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialFundingSourceFacade } from '@cms/case-management/domain';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-funding-source-page',
  templateUrl: './funding-source-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundingSourcePageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  addFundingSource$ = this.financialFundingSourceFacade.addFundingSource$
  updateFundingSource$ = this.financialFundingSourceFacade.updateFundingSource$
  claimsType: any;

  sortType = this.financialFundingSourceFacade.sortType;
  pageSizes = this.financialFundingSourceFacade.gridPageSizes;
  gridSkipCount = this.financialFundingSourceFacade.skipCount;

  sortValueFinancialFundingSourceFacade =
    this.financialFundingSourceFacade.sortValueFinancialFundingSourceFacade;
  sortProcessList = this.financialFundingSourceFacade.sortProcessList;

  state!: State;
  financialFundingSourceFacadeGridLists$ =
    this.financialFundingSourceFacade.financialFundingSourceFacadeData$;

    gridFinancialFundingSourcesDataSubject = new Subject<any>();
    gridFinancialFundingSourceData$ =this.gridFinancialFundingSourcesDataSubject.asObservable();

  constructor(
    private readonly financialFundingSourceFacade: FinancialFundingSourceFacade,

  ) { }


  loadFinancialFundingSourceFacadeListGrid(event: any) {
    this.financialFundingSourceFacade.loadFinancialFundingSourceFacadeListGrid();
  }

  addFundingSource(event: any) {
    this.financialFundingSourceFacade.addFundingSource(event)
  }

  updateFundingSource(event: any) {
    this.financialFundingSourceFacade.updateFundingSource(event)
  }

}




