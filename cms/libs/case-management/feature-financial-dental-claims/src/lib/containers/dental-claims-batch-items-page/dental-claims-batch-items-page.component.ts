import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialDentalClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-dental-claims-batch-items-page',
  templateUrl: './dental-claims-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialDentalClaimsFacade.sortValueBatchItem;
   sortType = this.financialDentalClaimsFacade.sortType;
   pageSizes = this.financialDentalClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialDentalClaimsFacade.skipCount;
   sort = this.financialDentalClaimsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialDentalClaimsFacade.batchItemsData$;
  constructor( 
    private readonly financialDentalClaimsFacade: FinancialDentalClaimsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialDentalClaimsFacade.loadBatchItemsListGrid();
  }
}
