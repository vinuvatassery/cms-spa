import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-financial-claims-batch-items-page',
  templateUrl: './financial-claims-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialClaimsFacade.sortValueBatchItem;
   sortType = this.financialClaimsFacade.sortType;
   pageSizes = this.financialClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialClaimsFacade.skipCount;
   sort = this.financialClaimsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialClaimsFacade.batchItemsData$;
  constructor( 
    private readonly financialClaimsFacade: FinancialClaimsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialClaimsFacade.loadBatchItemsListGrid();
  }
}
