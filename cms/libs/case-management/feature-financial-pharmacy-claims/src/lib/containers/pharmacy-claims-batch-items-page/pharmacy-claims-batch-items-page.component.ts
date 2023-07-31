import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-pharmacy-claims-batch-items-page',
  templateUrl: './pharmacy-claims-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialPharmacyClaimsFacade.sortValueBatchItem;
   sortType = this.financialPharmacyClaimsFacade.sortType;
   pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
   gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
   sort = this.financialPharmacyClaimsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialPharmacyClaimsFacade.batchItemsData$;
  constructor( 
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialPharmacyClaimsFacade.loadBatchItemsListGrid();
  }
}
