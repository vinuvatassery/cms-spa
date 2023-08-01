import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-financial-premiums-batch-items-page',
  templateUrl: './financial-premiums-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPremiumsFacade.sortValueBatchItem;
   sortType = this.financialPremiumsFacade.sortType;
   pageSizes = this.financialPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialPremiumsFacade.skipCount;
   sort = this.financialPremiumsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPremiumsFacade.batchItemsData$;
  constructor( 
    private readonly financialPremiumsFacade: FinancialPremiumsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialPremiumsFacade.loadBatchItemsListGrid();
  }
}
