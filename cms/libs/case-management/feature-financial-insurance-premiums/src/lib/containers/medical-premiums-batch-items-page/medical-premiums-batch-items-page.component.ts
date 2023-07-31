import {  ChangeDetectionStrategy,  Component, } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialMedicalPremiumsFacade } from '@cms/case-management/domain'; 

@Component({
  selector: 'cms-medical-premiums-batch-items-page',
  templateUrl: './medical-premiums-batch-items-page.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsBatchItemsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

   sortValue = this.financialMedicalPremiumsFacade.sortValueBatchItem;
   sortType = this.financialMedicalPremiumsFacade.sortType;
   pageSizes = this.financialMedicalPremiumsFacade.gridPageSizes;
   gridSkipCount = this.financialMedicalPremiumsFacade.skipCount;
   sort = this.financialMedicalPremiumsFacade.sortBatchItemList;
   state!: State;
   batchItemsGridLists$ = this.financialMedicalPremiumsFacade.batchItemsData$;
  constructor( 
    private readonly financialMedicalPremiumsFacade: FinancialMedicalPremiumsFacade 
  ) {}

  loadBatchItemListGrid(event: any) { 
    this.financialMedicalPremiumsFacade.loadBatchItemsListGrid();
  }
}
