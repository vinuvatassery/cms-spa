import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-dental-premiums-batch-items-page',
  templateUrl: './dental-premiums-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialDentalPremiumsFacade.sortValueBatchItem;
   sortType = this.financialDentalPremiumsFacade.sortType;
   pageSizes = this.financialDentalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalPremiumsFacade.skipCount;
   sort = this.financialDentalPremiumsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialDentalPremiumsFacade.batchItemsData$;
  constructor( 
    private readonly financialDentalPremiumsFacade: FinancialDentalPremiumsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialDentalPremiumsFacade.loadBatchItemsListGrid();
  }
}
